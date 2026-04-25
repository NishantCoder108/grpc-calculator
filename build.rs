use std::{env, error::Error, path::PathBuf};

fn main() -> Result<(), Box<dyn Error>> {
    let out_dir = PathBuf::from(env::var("OUT_DIR").unwrap());
    tonic_prost_build::configure()
        // .build_server(false) // If set to false, disables generating server-side code. Useful if you only need the client stubs.
        .file_descriptor_set_path(out_dir.join("calculator_descriptor.bin"))
        .compile_protos(&["proto/calculator.proto"], &["proto/"])?;
    Ok(())
}
