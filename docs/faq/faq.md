---
id: faq
slug: /faq/faq
title: FAQ
sidebar_position: 1
---

## Q: What is the difference between Iggy and traditional message brokers like Kafka?

Iggy is a persistent message streaming platform that stores messages in an append-only log format, similar to Kafka. However, Iggy is designed for high performance and low latency using `io_uring` and a thread-per-core architecture. Iggy doesn't use kafka protocol, instead it has its own binary protocol optimized for speed and efficiency, which means that clients need to use our native client libraries.

## Q: Are there plans to support Kafka protocol in Iggy?

Currently, Iggy does not support the Kafka protocol. Our focus is on providing a high-performance native protocol that leverages the strengths of Iggy’s architecture. However, we are open to community contributions (in fact there is an [discussion](https://github.com/apache/iggy/discussions/6) about it).
