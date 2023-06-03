---
path: "/blogs/mcunet"
date: "2020-11-16"
title: "Running Machine learning and deep learning Inferences on IoT devices with MCUNet"
author: "Olalekan Taofeek"
timeToRead: "3"
smallTitle: "MCUNet with TinyNAS and TinyEngine"
description: "Running Machine learning and deep learning Inferences on IoT devices with MCUNet"
postNum: "26"
---

<br/>
<br/>
<br/>

## **The era of always-on tiny machine learning on IoT devices with MCUNet**

The constraint resources of most embedded devices pose a challenge to fitting the off-the-shelf machine learning and deep learning model directly to them. However, embedded IoT devices are still one of the best ways we can bring AI Applications to every aspect of our daily life including personalized healthcare, precision agriculture, smart cities, homes and smart factories—which will give many people including those in the low-resource end with less quality Internet resources to enjoy the benefit of AI.

Here comes an amazing paper from MIT which addresses the challenges of running a deep learning model on embedded devices through a system-algorithm co-design (TinyNAS and TinyEngine).TinyNAS— which helps perform some evolution search to find the best model within the search space that meet the onboard constraint while achieving the highest accuracy. And leverage the TinyEngine—Inference library that optimizes the memory scheduling of each model by eliminating the unnecessary memory overhead and reducing the adaptive memory scheduling.

Most Researchers used to assume that deep learning frameworks such as TensorFlow and PyTorch will only affect Inference speed and not accuracy which is not the case for TinyML. The system-algorithm co-design TinyNAS and TinyEngine for model Inference have solved a lot of challenges which always arise with model quantization and that always comes with a question of what do you sacrifice and what do you optimize. We don’t have to sacrifice one for the other and MCUNet has really addressed most of these problems and is pushing further the era of always-on tiny machine learning on IoT devices.

Their paper is really great to understand their methodology and the techniques that help them achieve such accuracy over other methods: https://arxiv.org/pdf/2007.10319v1.pdf
