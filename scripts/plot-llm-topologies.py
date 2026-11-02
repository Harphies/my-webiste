"""Reproduce the article's GLM-5.3 figures from saved benchmark metrics; no inference."""
import argparse
import csv
import math
from pathlib import Path

SERIES = {
    'AGG 1xTP4': ('AGG 1×TP4 · 4 GPUs', '#0072B2', 'o', 4),
    'AGG 2xTP4': ('AGG 2×TP4 · 8 GPUs', '#009E73', 's', 8),
    'PD 3P1D': ('PD 3P1D · 20 GPUs', '#D55E00', '^', 20),
}
COMMON = (1, 2, 4, 8, 16, 32, 64, 128)


def load(path):
    rows = list(csv.DictReader(path.open()))
    for r in rows:
        for key in ('gpus', 'concurrency', 'requests', 'errors'):
            r[key] = int(r[key])
        for key in ('mean_input_tokens', 'mean_output_tokens', 'output_tok_s', 'output_tok_s_gpu', 'decode_tok_s_user',
                    'ttft_p50_s', 'ttft_p95_s', 'ttft_p99_s', 'itl_p50_ms', 'itl_p95_ms', 'itl_p99_ms'):
            r[key] = float(r[key])
            if not math.isfinite(r[key]) or r[key] <= 0:
                raise ValueError(f'Invalid {key}')
        if r['topology'] not in SERIES or r['errors'] or r['requests'] != max(32, 4*r['concurrency']):
            raise ValueError('Unexpected topology, failed requests or partial point')
        if r['gpus'] != SERIES[r['topology']][3] or not math.isclose(r['output_tok_s_gpu'], r['output_tok_s']/r['gpus']):
            raise ValueError('GPU denominator mismatch')
        if not 7000 <= r['mean_input_tokens'] <= 9000 or r['mean_output_tokens'] != 1000:
            raise ValueError('Workload shape mismatch')
        for key in ('client_cached_input_fraction', 'engine_cached_input_fraction'):
            if key == 'engine_cached_input_fraction' and r['topology'] == 'PD 3P1D' and r[key] == '':
                continue
            v = float(r[key])
            if not math.isfinite(v) or not 0 <= v <= .01:
                raise ValueError('Missing or non-cold cache evidence')
    for key in SERIES:
        expected = COMMON + ((256,) if key == 'AGG 2xTP4' else ())
        if sorted(r['concurrency'] for r in rows if r['topology'] == key) != list(expected):
            raise ValueError(f'Missing or duplicate points: {key}')
    return rows


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('--data', type=Path, default=Path('static/data/glm53-topology-8k1k-20261102.csv'))
    p.add_argument('--output', type=Path, default=Path('src/pages/post_38'))
    p.add_argument('--svg-output', type=Path, default=Path('static/plots'))
    args = p.parse_args()
    rows = load(args.data)
    import matplotlib
    matplotlib.use('Agg')
    import matplotlib.pyplot as plt
    plt.rcParams.update({'font.family':'DejaVu Sans', 'font.size':11, 'axes.titlesize':13,
        'axes.labelsize':11, 'axes.spines.top':False, 'axes.spines.right':False,
        'grid.color':'#E5E7EB', 'grid.linewidth':.8, 'svg.fonttype':'none'})
    args.output.mkdir(parents=True, exist_ok=True)
    args.svg_output.mkdir(parents=True, exist_ok=True)
    data = {k:sorted((r for r in rows if r['topology']==k), key=lambda r:r['concurrency']) for k in SERIES}
    ticks = COMMON + (256,)
    caption = ('Cold 8k input target / fixed 1k output. AGG: lab; PD: production. All serving GPUs counted.\n'
               'C1–128 common; only 2×TP4 measured C256. Different GPU/memory budgets and configurations.')
    def decorate(fig, title, axes):
        fig.suptitle(title, fontsize=17, fontweight='bold', y=.985)
        handles, labels = axes[0].get_legend_handles_labels()
        fig.legend(handles, labels, loc='upper center', bbox_to_anchor=(.5,.945), ncol=3, frameon=False, fontsize=10)
        fig.text(.5,.015,caption,ha='center',fontsize=9,color='#4B5563')
        fig.tight_layout(rect=(0,.07,1,.88))
    def save(fig, name):
        fig.savefig(args.output/f'{name}.png',dpi=200,facecolor='white')
        fig.savefig(args.svg_output/f'{name}.svg',facecolor='white')
        plt.close(fig)
    def concurrency_axis(ax):
        ax.set_xscale('log',base=2)
        ax.set_xticks(ticks, [str(c)for c in ticks])
        ax.set_xlabel('Concurrent requests')
        ax.grid(alpha=.85)
        ax.set_ylim(bottom=0)
        ax.margins(y=.12)
    # One panel per latency distribution; do not mix median with tail or token gaps with request means.
    fig, axs = plt.subplots(2,2,figsize=(12,9))
    panels = [('ttft_p50_s','TTFT · p50','Seconds'), ('ttft_p95_s','TTFT · p95','Seconds'),
              ('itl_p50_ms','Request-average ITL · p50','Milliseconds'), ('itl_p95_ms','Request-average ITL · p95','Milliseconds')]
    for ax,(field,title,unit) in zip(axs.flat,panels):
        for key,(label,color,marker,_) in SERIES.items():
            series=data[key]
            ax.plot([r['concurrency']for r in series],[r[field]for r in series],label=label,color=color,marker=marker,linewidth=2)
        ax.set_title(title,loc='left')
        ax.set_ylabel(unit)
        concurrency_axis(ax)
    decorate(fig,'GLM-5.3 · latency across serving topologies',list(axs.flat))
    save(fig,'glm53-topology-latency')
    # Show aggregate capacity, efficiency and per-user rate as distinct quantities.
    fig, axs = plt.subplots(3,1,figsize=(11,12))
    for ax,(field,title,unit) in zip(axs,[('output_tok_s','Total output','Tokens/s'),
        ('output_tok_s_gpu','Efficiency across all serving GPUs','Tokens/s/GPU'),
        ('decode_tok_s_user','Mean per-request decode rate','Tokens/s/user')]):
        for key,(label,color,marker,_) in SERIES.items():
            series=data[key]
            ax.plot([r['concurrency']for r in series],[r[field]for r in series],label=label,color=color,marker=marker,linewidth=2)
        ax.set_title(title,loc='left');ax.set_ylabel(unit);concurrency_axis(ax)
    decorate(fig,'GLM-5.3 · concurrency changes the tradeoff',list(axs))
    save(fig,'glm53-topology-scaling')
    # Matched approximate per-replica loads overlap; separate annotations to keep their C labels readable.
    fig, ax = plt.subplots(figsize=(11,8))
    offsets = {'AGG 1xTP4':(-8,10), 'AGG 2xTP4':(7,-18), 'PD 3P1D':(6,5)}
    for key,(label,color,marker,_)in SERIES.items():
        series=data[key]
        ax.plot([r['decode_tok_s_user']for r in series],[r['output_tok_s_gpu']for r in series],label=label,color=color,marker=marker,linewidth=2)
        for r in series:
            if r['concurrency'] in (8,32,64,128,256):
                ax.annotate(f'C{r["concurrency"]}',(r['decode_tok_s_user'],r['output_tok_s_gpu']),
                    xytext=offsets[key],textcoords='offset points',fontsize=9,color=color)
    ax.set(xlabel='Mean per-request decode rate · tokens/s/user',ylabel='Total output / all serving GPUs · tokens/s/GPU')
    ax.set_ylim(bottom=0);ax.margins(x=.08,y=.10);ax.grid(alpha=.85)
    decorate(fig,'GLM-5.3 · per-user speed versus GPU efficiency',[ax])
    save(fig,'glm53-topology-envelope')
    print('Wrote three PNG/SVG figures from 25 validated saved points. No inference sent.')


if __name__=='__main__':main()
