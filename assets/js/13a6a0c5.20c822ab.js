"use strict";(self.webpackChunkiggy_website=self.webpackChunkiggy_website||[]).push([[2409],{7017:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>c,contentTitle:()=>a,default:()=>d,frontMatter:()=>o,metadata:()=>r,toc:()=>l});const r=JSON.parse('{"id":"introduction/introduction-stream-builder","title":"Stream Builder","description":"In the previous section, the high level SDK introduced the connection string to simplify the client configuration and","source":"@site/docs/introduction/stream_builder.md","sourceDirName":"introduction","slug":"/introduction/stream-builder","permalink":"/docs/introduction/stream-builder","draft":false,"unlisted":false,"tags":[],"version":"current","sidebarPosition":5,"frontMatter":{"id":"introduction-stream-builder","slug":"/introduction/stream-builder","title":"Stream Builder","sidebar_position":5},"sidebar":"tutorialSidebar","previous":{"title":"High-level SDK","permalink":"/docs/introduction/high-level-sdk"},"next":{"title":"Introduction","permalink":"/docs/server/introduction"}}');var i=t(4848),s=t(8453);const o={id:"introduction-stream-builder",slug:"/introduction/stream-builder",title:"Stream Builder",sidebar_position:5},a=void 0,c={},l=[{value:"IggyStream Builder",id:"iggystream-builder",level:2},{value:"IggyStreamProducer Builder",id:"iggystreamproducer-builder",level:2},{value:"Producer configuration",id:"producer-configuration",level:3},{value:"IggyStreamConsumer Builder",id:"iggystreamconsumer-builder",level:2},{value:"Build consumer and client",id:"build-consumer-and-client",level:3},{value:"Build consumer from an existing client",id:"build-consumer-from-an-existing-client",level:3},{value:"Consumer configuration",id:"consumer-configuration",level:3},{value:"Add consumers dynamically at runtime.",id:"add-consumers-dynamically-at-runtime",level:2},{value:"Add producers dynamically at runtime.",id:"add-producers-dynamically-at-runtime",level:2}];function u(e){const n={a:"a",code:"code",h2:"h2",h3:"h3",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",...(0,s.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(n.p,{children:"In the previous section, the high level SDK introduced the connection string to simplify the client configuration and\nindeed, it does provide a simple way to connect to the server. However, when you write an event based application,\nyou typically encounter one or more of the following scenarios:"}),"\n",(0,i.jsxs)(n.ol,{children:["\n",(0,i.jsx)(n.li,{children:"The consumer and producer operate on the same stream and topic."}),"\n",(0,i.jsx)(n.li,{children:"The consumer operates on different streams and topics."}),"\n",(0,i.jsx)(n.li,{children:"The producers operate on different streams and topics."}),"\n",(0,i.jsx)(n.li,{children:"Add consumers dynamically at runtime."}),"\n",(0,i.jsx)(n.li,{children:"Add producers dynamically at runtime."}),"\n"]}),"\n",(0,i.jsxs)(n.p,{children:["The stream builder provides a convenient way to create the iggy client, producer and consumer for these use cases.\nAll source code examples are located in the ",(0,i.jsx)(n.a,{href:"https://github.com/iggy-rs/iggy/tree/master/examples/src/stream-builder",children:(0,i.jsx)(n.strong,{children:"examples folder"})})," of the iggy repository. Also,\nif you encounter a problem with any of the examples below, please ask in the ",(0,i.jsx)(n.a,{href:"https://discord.gg/C5Sux5NcRa",children:(0,i.jsx)(n.strong,{children:"community discord"})}),"."]}),"\n",(0,i.jsx)(n.h2,{id:"iggystream-builder",children:"IggyStream Builder"}),"\n",(0,i.jsx)(n.p,{children:"In the first case, the IggyStream Builder offers a fast and efficient way to get you started:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-rust",children:'use iggy::client::{Client, StreamClient};\nuse iggy::consumer_ext::IggyConsumerMessageExt;\nuse iggy::error::IggyError;\nuse iggy::messages::send_messages::Message;\nuse iggy::stream_builder::{IggyStream, IggyStreamConfig};\nuse iggy_examples::shared::stream::PrintEventConsumer;\nuse std::str::FromStr;\nuse tokio::sync::oneshot;\n\nconst IGGY_URL: &str = "iggy://iggy:iggy@localhost:8090";\n\n#[tokio::main]\nasync fn main() -> Result<(), IggyError> {\n    let stream_config = IggyStreamConfig::default();\n    let (client, producer, consumer) = \n    IggyStream::with_client_from_connection_string(IGGY_URL, &stream_config).await?;\n    \n    let (sender, receiver) = oneshot::channel();\n    tokio::spawn(async move {\n        match consumer.consume_messages(&PrintEventConsumer {}, receiver)\n        .await {\n            Ok(_) => {}\n            Err(err) => eprintln!("Failed to consume messages: {err}"),\n        }\n    });\n\n    producer.send_one(Message::from_str("Hello World")?).await?;\n    tokio::time::sleep(tokio::time::Duration::from_secs(1)).await;\n\n    sender.send(()).expect("Failed to send shutdown signal");\n    client.delete_stream(stream_config.stream_id()).await?;\n    client.shutdown().await?;\n\n    Ok(())\n}\n'})}),"\n",(0,i.jsxs)(n.p,{children:["As you can see, the ",(0,i.jsx)(n.code,{children:"IggyStream"})," builder is used to create the iggy client, producer and consumer.\nHere, we use the default configuration to get started quickly, but you can always customize the configuration to fit\nyour requirements."]}),"\n",(0,i.jsxs)(n.p,{children:["The ",(0,i.jsx)(n.code,{children:"consume_messages"})," method is not part of the IggyConsumer; instead, you import the IggyConsumerMessageExt\ntrait which provides the ",(0,i.jsx)(n.code,{children:"consume_messages"})," method. The PrintEventConsumer implements the MessageConsumer trait\nand is invoked to process each incoming message. A simple implementation is show below:"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-rust",children:'use iggy::clients::consumer::ReceivedMessage;\nuse iggy::consumer_ext::MessageConsumer;\nuse iggy::error::IggyError;\n\n#[derive(Debug)]\npub struct PrintEventConsumer {}\n\nimpl MessageConsumer for PrintEventConsumer {\n    async fn consume(&self, message: ReceivedMessage) -> Result<(), IggyError> {\n        // Extract message payload as raw bytes\n        let raw_message = message.message.payload.as_ref();\n        let message = String::from_utf8_lossy(raw_message);\n        println!("Message received: {}", message);\n\n        Ok(())\n    }\n}\n'})}),"\n",(0,i.jsx)(n.h2,{id:"iggystreamproducer-builder",children:"IggyStreamProducer Builder"}),"\n",(0,i.jsxs)(n.p,{children:["When you implement the producer side, you can use the ",(0,i.jsx)(n.code,{children:"IggyStreamProducer"})," to get started:"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-rust",children:'use iggy::client::{Client, StreamClient};\nuse iggy::error::IggyError;\nuse iggy::messages::send_messages::Message;\nuse iggy::stream_builder::{IggyProducerConfig, IggyStreamProducer};\nuse std::str::FromStr;\n\nconst IGGY_URL: &str = "iggy://iggy:iggy@localhost:8090";\n\n#[tokio::main]\nasync fn main() -> Result<(), IggyError> {\n    let config = IggyProducerConfig::default();\n    let (client, producer) = \n    IggyStreamProducer::with_client_from_url(IGGY_URL, &config).await?;\n\n    producer.send_one(Message::from_str("Hola Iggy")?).await?;\n\n    // Wait a bit for all messages to arrive.\n    tokio::time::sleep(tokio::time::Duration::from_secs(3)).await;\n    println!("Stop the message stream and shutdown iggy client");\n    client.delete_stream(config.stream_id()).await?;\n    client.shutdown().await?;\n    Ok(())\n}\n'})}),"\n",(0,i.jsxs)(n.p,{children:["If you already have a custom iggy client, you can use that one by replacing the ",(0,i.jsx)(n.code,{children:"with_client_from_url"}),"\nconstructor with the following:"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-rust",children:"    let producer = IggyStreamProducer::build(&client, &config).await?;\n"})}),"\n",(0,i.jsxs)(n.p,{children:["You find sample utils to build a customized iggy client in\nthe ",(0,i.jsx)(n.a,{href:"https://github.com/iggy-rs/iggy/blob/master/examples/src/shared/client.rs",children:(0,i.jsx)(n.strong,{children:"examples folder"})})," of the iggy\nrepository."]}),"\n",(0,i.jsx)(n.h3,{id:"producer-configuration",children:"Producer configuration"}),"\n",(0,i.jsxs)(n.p,{children:["The IggyProducerConfig gives you a way to configure the producer in sufficient detail. Please note, if you have\nquestions about any of those settings, please ask in the community discord. For basic customization, the ",(0,i.jsx)(n.code,{children:"from_stream_topic"})," constructor\nlets you set a custom stream and topic name as well as the maximum batch size and message send interval."]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-rust",children:'use iggy::stream_builder::{IggyProducerConfig};\nuse iggy::utils::duration::IggyDuration;\nuse std::str::FromStr;\n\nlet res = IggyProducerConfig::from_stream_topic(\n            "test_stream",\n            "test_topic",\n            100,\n            IggyDuration::from_str("5ms").unwrap(),\n         ).unwrap();\n'})}),"\n",(0,i.jsx)(n.p,{children:"The remaining configuration fields are set to default values applicable to the most common use case. This should be sufficient for a simple application, or proof of concept without getting lost in details.\nHowever, for more complex applications, you might want to configure more\ndetails and for that, see below a commented example of the full producer configuration:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-rust",children:'use iggy::error::IggyError;\nuse iggy::identifier::Identifier;\nuse iggy::messages::send_messages::{Partitioning};\nuse iggy::stream_builder::{IggyProducerConfig};\nuse iggy::utils::duration::IggyDuration;\nuse std::str::FromStr;\n\n#[tokio::main]\nasync fn main() -> Result<(), IggyError> {\n    let stream = "test_stream";\n    let topic = "test_topic";\n\n    // The builder simplifies the IggyProducer configuration.\n    let config = IggyProducerConfig::builder()\n        // Set the stream identifier and name.\n        .stream_id(stream.try_into()?)\n        .stream_name(stream)\n        // Set the topic identifier and name\n        .topic_id(topic.try_into()?)\n        .topic_name(topic)\n        // Sets the number of partitions to create for the topic.\n        // The more clients are reading concurrently, \n        // the more partitions you should create.\n        // i.e. if you have 10 clients, you should create 10 partitions\n        .topic_partitions_count(10)\n        // Optionally, you can set the replication factor for redundancy.\n        // There is a tradeoff between replication factor and performance,\n        // so you better benchmark your setup.\n        .topic_replication_factor(2)\n        // The max number of messages to send in a batch. \n        // The greater the batch size, the higher the bulk throughput.\n        // Note, there is a tradeoff between batch size and latency, \n        // so you want to benchmark your setup.\n        .batch_size(100)\n        // Sets the interval between sending the messages.  \n        // Affects latency so you want to benchmark.\n        .send_interval(IggyDuration::from_str("5ms").unwrap())\n        // `Partitioning` specifies to which partition the messages \n        // should be sent.\n        // It has the following options:\n        // - `Balanced` - round-robin dispatch.\n        // - `PartitionId` - the partition ID is provided by the client.\n        // - `MessagesKey` - the partition ID is calculated by the server \n        //    using the hash of the provided messages key.\n        .partitioning(Partitioning::balanced())\n        // Sets the retry policy (maximum number of retries and interval) \n        // in case of messages sending failure.\n        // The error can be related either to disconnecting from the server \n        // or to the server rejecting the messages.\n        // Default is 3 retries with 1 second interval between them.\n        .send_retries_count(3)\n        .send_retries_interval(IggyDuration::new_from_secs(1))\n        // Optionally, set a custom client side encryptor for encrypting \n        // the messages\' payloads. Currently only Aes256Gcm is supported.\n        // Note, this is independent of server side encryption.\n        // You can add client encryption, server encryption, or both.\n        // .encryptor(Arc::new(EncryptorKind::Aes256Gcm(Aes256GcmEncryptor::new(&[1; 32])?)))\n        .build();\n    Ok(())\n}\n'})}),"\n",(0,i.jsxs)(n.p,{children:["Note, when your requirements exceed this configuration, you can still\nuse the ",(0,i.jsx)(n.a,{href:"https://github.com/iggy-rs/iggy/blob/master/examples/src/basic/producer/main.rs",children:(0,i.jsx)(n.strong,{children:"underlying low level SDK"})})," for fine grained control over every detail of the producer."]}),"\n",(0,i.jsx)(n.h2,{id:"iggystreamconsumer-builder",children:"IggyStreamConsumer Builder"}),"\n",(0,i.jsxs)(n.p,{children:["When you have an existing server with multiple producers, you may have to implement a consumer for a specific stream or\ntopic. In some cases you may already have a configured iggy client, in others you may need to create\none. In either case, you can use the ",(0,i.jsx)(n.code,{children:"IggyStreamConsumer"})," to create the consumer."]}),"\n",(0,i.jsx)(n.h3,{id:"build-consumer-and-client",children:"Build consumer and client"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-rust",children:'use iggy::client::Client;\nuse iggy::consumer_ext::IggyConsumerMessageExt;\nuse iggy::error::IggyError;\nuse iggy::stream_builder::{IggyConsumerConfig, IggyStreamConsumer};\nuse iggy_examples::shared::stream::PrintEventConsumer;\nuse tokio::sync::oneshot;\n\nconst IGGY_URL: &str = "iggy://iggy:iggy@localhost:8090";\n\n#[tokio::main]\nasync fn main() -> Result<(), IggyError> {\n    let config = IggyConsumerConfig::default();\n    let (client, consumer) = \n    IggyStreamConsumer::with_client_from_url(IGGY_URL, &config).await?;\n\n    let (tx, rx) = oneshot::channel();\n    tokio::spawn(async move {\n        match consumer.consume_messages(&PrintEventConsumer {}, rx)\n            .await{\n            Ok(_) => {}\n            Err(err) => eprintln!("Failed to consume messages: {err}"),\n        }\n    });\n\n    // Wait a bit for all messages to arrive.\n    tokio::time::sleep(tokio::time::Duration::from_secs(10)).await;\n    println!("Stop the message stream and shutdown iggy client");\n    tx.send(()).expect("Failed to send shutdown signal");\n    client.shutdown().await?;\n    Ok(())\n}\n'})}),"\n",(0,i.jsx)(n.p,{children:"Similar to the previous StreamBuilder, the IggyConsumerMessageExt is used to process messages using\nthe PrintEventConsumer implementation of the MessageConsumer trait."}),"\n",(0,i.jsx)(n.h3,{id:"build-consumer-from-an-existing-client",children:"Build consumer from an existing client"}),"\n",(0,i.jsxs)(n.p,{children:["In the event that you have an existing iggy client, you can use the ",(0,i.jsx)(n.code,{children:"IggyStreamConsumer::build"})," method to create the\nconsumer. To do so, just replace the ",(0,i.jsx)(n.code,{children:"with_client_from_url"})," with the following:"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-rust",children:" let consumer= IggyStreamConsumer::build(&client, &config).await?;\n"})}),"\n",(0,i.jsxs)(n.p,{children:["Notice, you find some utils to build a customized iggy client in\nthe ",(0,i.jsx)(n.a,{href:"https://github.com/iggy-rs/iggy/blob/master/examples/src/shared/client.rs",children:(0,i.jsx)(n.strong,{children:"examples folder"})})," of the iggy\nrepository."]}),"\n",(0,i.jsx)(n.h3,{id:"consumer-configuration",children:"Consumer configuration"}),"\n",(0,i.jsxs)(n.p,{children:["The default configuration only exists to get you started quickly i.e. to test out an idea, draft an proof of concept or\nsimilar. In practice, you often want fine grained control over the configuration. The IggyConsumerConfig gives you a way\nto configure the consumer in sufficient detail without distracting with low level details.\nPlease note, if you have questions about any of those settings, please ask in\nthe ",(0,i.jsx)(n.a,{href:"https://discord.gg/C5Sux5NcRa",children:"community discord"}),". See below a commented configuration example:"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-rust",children:'use iggy::clients::consumer::{AutoCommit, AutoCommitWhen};\nuse iggy::consumer::ConsumerKind;\nuse iggy::error::IggyError;\nuse iggy::identifier::Identifier;\nuse iggy::messages::poll_messages::PollingStrategy;\nuse iggy::stream_builder::{IggyConsumerConfig};\nuse iggy::utils::duration::IggyDuration;\nuse std::str::FromStr;\n\n#[tokio::main]\nasync fn main() -> Result<(), IggyError> {\n  let stream = "test_stream";\n  let topic = "test_topic";\n\n  let config = IggyConsumerConfig::builder()\n    // Set the stream identifier and name.\n    .stream_id(stream.try_into()?)\n    .stream_name(stream)\n    // Set the topic identifier and name\n    .topic_id(topic.try_into()?)\n    .topic_name(topic)\n    // The auto-commit configuration for storing the message offset.\n    // See: https://github.com/iggy-rs/iggy/blob/master/sdk/src/clients/consumer.rs\n    .auto_commit(AutoCommit::When(AutoCommitWhen::PollingMessages))\n    // The max number of messages to send in a batch. \n    // The greater the batch size, the higher the bulk throughput.\n    // Note, there is a tradeoff between batch size and latency, \n    // so you want to benchmark your configuration.\n    // Note, this only applies to batch send messages. \n    // Single messages are sent immediately.\n    .batch_size(100)\n    // Create the stream if it doesn\'t exist.\n    .create_stream_if_not_exists(true)\n    // Create the topic if it doesn\'t exist.\n    .create_topic_if_not_exists(true)\n    // The name of the consumer. Must be unique.\n    .consumer_name("test_consumer".to_string())\n    // The type of consumer. It can be either `Consumer` or `ConsumerGroup`. \n    // ConsumerGroup is default.\n    .consumer_kind(ConsumerKind::ConsumerGroup)\n    // Sets the number of partitions for ConsumerKind `Consumer`. \n    // Does not apply to `ConsumerGroup`.\n    .partitions_count(1)\n    // The polling interval for messages.\n    .polling_interval(IggyDuration::from_str("5ms").unwrap())\n    // `PollingStrategy` specifies from where to start polling messages.\n    // It has the following kinds:\n    // - `Offset` - start polling from the specified offset.\n    // - `Timestamp` - start polling from the specified timestamp.\n    // - `First` - start polling from the first message in the partition. \n    // - `Last` - start polling from the last message in the partition. \n    // - `Next` - start polling from the next message after the \n    // last polled message based on the stored consumer offset.\n    .polling_strategy(PollingStrategy::last())\n    // Sets the polling retry interval in case of server disconnection.\n    .polling_retry_interval(IggyDuration::new_from_secs(1))\n    // Sets the number of retries and the interval when initializing \n    // the consumer if the stream or topic is not found.\n    // Might be useful when the stream or topic is created dynamically \n    // by the producer.\n    // The retry only occurs when configured and is disabled by default.\n    // When you want to retry at most 5 times with an interval of 1 second,\n    // you set `init_retries` to 5 and `init_interval` to 1 second.\n    .init_retries(5)\n    .init_interval(IggyDuration::new_from_secs(1))\n    // Optionally, set a custom client side encryptor for encrypting \n    // the messages\' payloads. Currently only Aes256Gcm is supported.\n    // Key must be identical to the one used by the producer; \n    // thus ensure secure key exchange.\n    // Note, this is independent of server side encryption.\n    // you can add client encryption, server encryption, or both.\n    // .encryptor(Arc::new(EncryptorKind::Aes256Gcm(Aes256GcmEncryptor::new(&[1; 32])?)))\n    .build();\n\n    Ok(())\n}\n'})}),"\n",(0,i.jsx)(n.h2,{id:"add-consumers-dynamically-at-runtime",children:"Add consumers dynamically at runtime."}),"\n",(0,i.jsxs)(n.p,{children:["When you create consumers on demand at application runtime, you have to\nensure that the stream and topic exist before creating the consumer and\nyou have to set the ",(0,i.jsx)(n.code,{children:"init_retries"})," and ",(0,i.jsx)(n.code,{children:"init_interval"})," in the stream builder\nto ensure the consumer retries a few more times in case the topic and stream are not immediately available."]}),"\n",(0,i.jsxs)(n.p,{children:["However, when you cannot guarantee that the stream or topic exist before the consumer starts,\nyou have to set ",(0,i.jsx)(n.code,{children:"create_stream_if_not_exists"})," and ",(0,i.jsx)(n.code,{children:"create_topic_if_not_exists"})," to ",(0,i.jsx)(n.code,{children:"true"})," in the IggyConsumerConfig\nto ensure the consumer creates them and starts correctly. Other than that, you just call the\n",(0,i.jsx)(n.code,{children:"IggyStreamConsumer::build"})," method as before i.e.:"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-rust",children:"    let config = get_my_custom_iggy_consumer_config();\n    let (client, consumer) = \n    IggyStreamConsumer::with_client_from_url(IGGY_URL, &config).await?;\n"})}),"\n",(0,i.jsxs)(n.p,{children:["Where ",(0,i.jsx)(n.code,{children:"get_my_custom_iggy_consumer_config"})," refers to a function that returns an ",(0,i.jsx)(n.code,{children:"IggyConsumerConfig"}),"\nthat specifies the stream and topic to consume as well the init retry or whether to create the stream and topic."]}),"\n",(0,i.jsx)(n.h2,{id:"add-producers-dynamically-at-runtime",children:"Add producers dynamically at runtime."}),"\n",(0,i.jsxs)(n.p,{children:["Adding new producers to the iggy server at runtime is as simple as creating a new config and\ncalling the ",(0,i.jsx)(n.code,{children:"IggyStreamProducer::build"})," method. Unlike the consumer, the producer always crates\nmissing streams or topics by default. The ",(0,i.jsx)(n.code,{children:"IggyConsumerConfig"})," has a convenient builder to create\na new configuration from just the stream, topic, batch size and send interval. See the example below."]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-rust",children:'    let config = IggyConsumerConfig::from_stream_topic(\n            "new_stream",\n            "new_topic",\n            100,\n            IggyDuration::from_str("5ms").unwrap(),\n        ).unwrap();\n        \n    let (client, consumer) = \n    IggyStreamConsumer::with_client_from_url(IGGY_URL, &config).await?;\n'})}),"\n",(0,i.jsxs)(n.p,{children:["If you encounter a problem with any of the examples show on this page,\nplease ask in the ",(0,i.jsx)(n.a,{href:"https://discord.gg/C5Sux5NcRa",children:(0,i.jsx)(n.strong,{children:"community discord"})}),"."]})]})}function d(e={}){const{wrapper:n}={...(0,s.R)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(u,{...e})}):u(e)}},8453:(e,n,t)=>{t.d(n,{R:()=>o,x:()=>a});var r=t(6540);const i={},s=r.createContext(i);function o(e){const n=r.useContext(s);return r.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function a(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:o(e.components),r.createElement(s.Provider,{value:n},e.children)}}}]);