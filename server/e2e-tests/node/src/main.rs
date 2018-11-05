extern crate env_logger;
#[macro_use]
extern crate slog_derive;


#[macro_use]
// needed until we can reexport `slog_info` from `substrate_telemetry`
extern crate slog;

#[macro_use]
extern crate substrate_telemetry;

use std::{thread, time};

#[derive(KV)]
struct ConnectionMessage {
    authority: bool,
    pubkey: String,
    chain: String,
    config: String,
    version: String,
    implementation: String,
    name: String,
}

impl ConnectionMessage {
    fn generate() -> Self {
        ConnectionMessage {
            authority: true,
            pubkey: String::from("5GoKvZWG5ZPYL1WUovuHW3zJBWBP5eT8CbqjdRY4Q6iMaDtZ"),
            chain: String::from("Local testnet"),
            config: String::new(),
            version: String::from("0.1.0-e9b2e36-x86_64-linux-gnu"),
            implementation: String::from("substrate-node"),
            name: String::from("third-doctor-9098"),
        }
    }
}

#[derive(KV)]
struct SystemIntervalMessage {
    best: String,
    cpu: f32,
    height: u64,
    memory: u64,
    peers: usize,
    status: String,
    txcount: usize,
}

impl SystemIntervalMessage {
    fn generate() -> Self {
        SystemIntervalMessage {
            best: String::from("0x0af03aeed54af647d55bf776ad00d4915926abd47e624408cbee1bb222910939"),
            cpu: 155.15152,
            height: 126,
            memory: 79284,
            peers: 1,
            status: String::from("Idle"),
            txcount: 0,
        }
    }
}

#[derive(KV)]
struct BlockImportMessage {
    best: String,
    height: u64,
    origin: String,
}

impl BlockImportMessage {
    fn generate() -> Self {
        BlockImportMessage {
            best: String::from("0x0af03aeed54af647d55bf776ad00d4915926abd47e624408cbee1bb222910939"),
            height: 127,
            origin: String::from("Own"),
        }
    }
}

fn main() {
    env_logger::init();
    let _telemetry = substrate_telemetry::init_telemetry(substrate_telemetry::TelemetryConfig {
        url: String::from("ws://localhost:5000/sockets"),
        on_connect: Box::new(move || {
            let msg = ConnectionMessage::generate();
            telemetry!("system.connected"; msg);
        }),
    });
    for i in 0..1000 {
        thread::sleep(time::Duration::from_secs(1));
        let interval_msg = SystemIntervalMessage::generate();
        telemetry!("system.interval"; interval_msg);
        if (i + 1) % 4 == 0 {
            thread::sleep(time::Duration::from_millis(200));
            let block_import_msg = BlockImportMessage::generate();
            telemetry!("block.import"; block_import_msg)
        }
    }
}
