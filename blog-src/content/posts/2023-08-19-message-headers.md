---
title: Message headers
slug: message-headers
authors: ["Piotr Gankiewicz"]
tags: [new-features, message-headers, breaking-changes]
hide_table_of_contents: false
---

The optional message headers which you can think of as an additional metadata for your messages have been recently implemented, Let's discover what these headers are, how to use them and more importantly, how to implement them in your own transport.

<!--truncate-->

## Breaking changes

The first draft of the message headers implementation starts with the initial commit [#bc1d0b3](https://github.com/iggy-rs/iggy/commit/bc1d0b369a268783bd329436aba3f6920aae478e). The breaking change to the streaming server has been introduced in the commit [#7c73bd3](https://github.com/iggy-rs/iggy/commit/7c73bd3d9d59fb685cbaaca5901dec6cac43ddaf) - up until this point, the existing implementation of the `SendMessages`, `PollMessages` and the underlying file system messages' storage does work without any breaking changes. The available [iggy crate](https://crates.io/crates/iggy) supports the headers since version 0.0.30. 

## Introduction

Message headers are an **optional** part of the message which can be used to provide the additional metadata for the message (they are not a part of the message body. Similar to e.g. HTTP headers, you can think of them as a **key-value pairs**, or more precisely the dictionary or map. The headers consist of the key and the value, where the key is a string (**UTF-8 bytes**) and the value is a byte array. 

Since the headers are optional, you can send a message without any headers at all. There's no limit on the number of headers you can send, but the total size of the headers is currently limited to **100 KB**. The header key is **case-sensitive**, so it's best to send the **lowercase** keys. The maximum length of the key and the value is **255 bytes** (the maximum value of the `u8` type).

For now, there are no reserved headers, so you can use any key you want. However, in the future, we might introduce some reserved headers used by the streaming server for the specific purposes such as the message compression, distributed tracing and so no.

The **sample applications** using the message headers can be found [here](https://github.com/iggy-rs/iggy/tree/master/examples/src/message-headers).

## Implementation

### Structures

We will start with the sample Rust implementation of the headers. The headers are defined as a `HashMap` where the key is a `string` (wrapped with a custom `HeaderKey` struct to enforce the validation) and the value is a `HeaderValue` struct. The `HeaderValue` struct consists of the `HeaderKind` enum and the `Vec<u8>` value. The `HeaderKind` enum defines the type of the value, which can be either a raw byte array or one of the primitive types.

The primitive types are defined as the enum variants, so you can easily match on them. The `HeaderKind` enum is used to validate the value and to serialize/deserialize it. The idea is that the value will always remain a byte array, but you can use the `HeaderKind` to convert it to the desired type.

```rust
pub struct HeaderKey(String);

pub struct HeaderValue {
    pub kind: HeaderKind,
    pub value: Vec<u8>
}

pub enum HeaderKind {
    Raw,
    String,
    Bool,
    Int8,
    Int16,
    Int32,
    Int64,
    Int128,
    Uint8,
    Uint16,
    Uint32,
    Uint64,
    Uint128,
    Float32,
    Float64
}
```

Next, let's take a look at the `SendMessages` command, and in particular we will see what has changed in the underlying `Message` struct (keep in mind that headers are unique per message, so they are not a part of the `SendMessages` command). The `Message` struct now has an additional `headers` field, which is a `HashMap` of `HeaderKey` and `HeaderValue` structs:

```rust
pub struct SendMessages {
    pub stream_id: Identifier,
    pub topic_id: Identifier,
    pub partitioning: Partitioning,
    pub messages: Vec<Message>
}

pub struct Message {
    pub id: u128,
    pub length: u32,
    pub payload: Bytes,
    pub headers: Option<HashMap<HeaderKey, HeaderValue>>
}
```

### JSON transport

Headers are optional, so depending on the programming language, you can either use the `option` type, or the `null` value, or even instantiate an `empty` map - it's up to you. The important part is the serialization. For the JSON transport, it's very easy, as you can see in the following example:

```json
{
  "partitioning": {
    "kind": "partition_id",
    "value": "{{partition_id_payload_base64}}"
  },
  "messages": [{
    "id": 0,
    "payload": "{{message_1_payload_base64}}"
  }, {
    "id": 0,
    "payload": "{{message_2_payload_base64}}",
    "headers": {
      "key_1": {
        "kind": "string",
        "value": "{{header_1_payload_base_64}}"
      }
    }
  }]
}
```

Simply put, in order to include the headers in the message, you need to add the `headers` field to the message struct. The `headers` field is a map of the `String` keys and the `HeaderValue` values. The `HeaderValue` value is a JSON object which consists of the `kind` and the `value` fields. The `kind` field is a string which defines the type of the value, and the `value` field is a base64-encoded byte array.

### Binary transport

Now, we can move on to the more complex part, being the binary transport (as always, it's the same schema for both, TCP and QUIC protocol).

We will begin with the headers serialization for the whole `HashMap`:

```rust
impl BytesSerializable for HashMap<HeaderKey, HeaderValue> {
    fn as_bytes(&self) -> Vec<u8> {
        if self.is_empty() {
            return EMPTY_BYTES;
        }

        let mut bytes = vec![];
        for (key, value) in self {
            bytes.put_u32_le(key.0.len() as u32);
            bytes.extend(key.0.as_bytes());
            bytes.put_u8(value.kind.as_code());
            bytes.put_u32_le(value.value.len() as u32);
            bytes.extend(&value.value);
        }

        bytes
    }
}
```

If for some reason, there are no headers, we return an empty byte array. Otherwise, we iterate over the headers and serialize them one by one. The serialization shouldn't be too difficult as we start with the key length, then we add the key itself (**UTF-8 bytes**), then we add the value type (the `HeaderKind` enum variant), then we add the value length, and finally we add the value itself (**UTF-8 bytes**).

The length of the single header is the following: `4 bytes` for the key length, `n bytes` (**1-255**) for the key, `1 byte` for the value kind, `4 bytes` for the value length and `n bytes` (**1-255**) for the value itself.

The `HeaderKind` uses the following codes:

```rust
impl HeaderKind {
    pub fn as_code(&self) -> u8 {
        match self {
            HeaderKind::Raw => 1,
            HeaderKind::String => 2,
            HeaderKind::Bool => 3,
            HeaderKind::Int8 => 4,
            HeaderKind::Int16 => 5,
            HeaderKind::Int32 => 6,
            HeaderKind::Int64 => 7,
            HeaderKind::Int128 => 8,
            HeaderKind::Uint8 => 9,
            HeaderKind::Uint16 => 10,
            HeaderKind::Uint32 => 11,
            HeaderKind::Uint64 => 12,
            HeaderKind::Uint128 => 13,
            HeaderKind::Float32 => 14,
            HeaderKind::Float64 => 15,
        }
    }
}
```

### Sending the messages with headers

Now, let's see how we can include the headers in a message serialization:

```rust
fn as_bytes(&self) -> Vec<u8> {
    let mut bytes = Vec::with_capacity(self.get_size_bytes() as usize);
    bytes.put_u128_le(self.id);
    if let Some(headers) = &self.headers {
        let headers_bytes = headers.as_bytes();
        bytes.put_u32_le(headers_bytes.len() as u32);
        bytes.extend(&headers_bytes);
    } else {
        bytes.put_u32_le(0);
    }
    bytes.put_u32_le(self.length);
    bytes.extend(&self.payload);
    bytes
}
```

The important thing to notice, is that the **headers are being serialized right after the `ID` and before the actual message payload**. At first, we add the total length of the headers' payload, then we add the headers themselves, and finally we include the message payload (length + value) as before. If the headers are not provided at all (e.g. `none` or `null` or an `empty` array), we add the `0` value as the headers' length, and we skip the headers' serialization, since there are no headers (an empty byte array).


### Polling the messages with headers

Eventually, let's discuss the `PollMessages` command. Nothing has changed here, except of the extended `Message` struct, which now contains the optional headers. For the JSON transport it's the same as when sending the messages, and for the binary transport, we need to deserialize the headers in the same way as we did when sending the messages. Let's find out how it works.


```rust
pub fn map_message(&self, bytes: &mut Vec<u8>) {
    bytes.put_u64_le(self.offset);
    bytes.put_u64_le(self.timestamp);
    bytes.put_u128_le(self.id);
    if let Some(headers) = &self.headers {
        let headers_bytes = headers.as_bytes();
        bytes.put_u32_le(headers_bytes.len() as u32);
        bytes.extend(&headers_bytes);
    } else {
        bytes.put_u32_le(0u32);
    }
    bytes.put_u32_le(self.length);
    bytes.extend(&self.payload);
}
```

As you can see, the headers are being serialized in the same way as when sending the messages. The only difference is that the `Message` struct also contains the `offset` and the `timestamp` fields, which are being serialized before the `ID` field. Besides that, nothing has changed, as we simply include the headers right after the `ID` field and before the actual message payload.

### Sample usage

The headers usage is pretty straightforward, as we simply need to create the new `HashMap`:

```rust
let mut headers = HashMap::new();
headers.insert(HeaderKey::new("key 1")?, HeaderValue::from_str("value1")?);
headers.insert(HeaderKey::new("key-2")?, HeaderValue::from_bool(true)?);
headers.insert(HeaderKey::new("key_3")?, HeaderValue::from_uint64(123456)?);
```

You might also use the conversion based on the implemented traits:

```rust
headers.insert("key".try_into()?, HeaderValue::from_float64(123.45)?);
let value = headers.get(&"key".try_into()?)?.as_float64()?;
```

Keep in mind, that the `HeaderKey` and the `HeaderValue` structs are being validated whenever you use one of the available methods to create them.

And then, we can send the messages with the headers (first `none` argument is for the optional ID):

```rust
let send_messages = SendMessages {
    stream_id: Identifier::numeric(1)?,
    topic_id: Identifier::named("sample")?,
    partitioning: Partitioning::balanced(),
    messages: vec![Message::new(None, Bytes::from("hello-world") , Some(headers))]
};
```

When you poll the messages and want to read the header value based on its kind, you can also use the existing helper methods, for example:

```rust
let value1 = headers.get(&HeaderKey::new("key 1")?)?.as_str()?;
let value2 = headers.get(&HeaderKey::new("key-2")?)?.as_bool()?;
let value3 = headers.get(&HeaderKey::new("key_3")?)?.as_uint64()?;
```