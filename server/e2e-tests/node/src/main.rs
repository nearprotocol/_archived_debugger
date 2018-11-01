#[macro_use]
// needed until we can reexport `slog_info` from `substrate_telemetry`
extern crate slog;
extern crate env_logger;

#[macro_use]
extern crate substrate_telemetry;

use std::{thread, time};

fn main() {
    env_logger::init();
    let _telemetry = substrate_telemetry::init_telemetry(substrate_telemetry::TelemetryConfig {
        url: String::from("ws://localhost:5000/sockets"),
        on_connect: Box::new(move || {
            telemetry!("system.connected";
                "howdy" => "hoo"
            );
            emit();
        }),
    });
    thread::sleep(time::Duration::from_secs(1));
}

fn emit() {
    for _ in 0..1000 {
        telemetry!("stats.update";
            "test" => "data"
        );
    }
}
