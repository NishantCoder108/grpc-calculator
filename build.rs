use std::{env, error::Error, path::PathBuf};

// fn main() -> Result<(), Box<dyn Error>> {
//     let out_dir = PathBuf::from(env::var("OUT_DIR").unwrap());

//     tonic_build::configure()
//         .file_descriptor_set_path(out_dir.join("calculator_descriptor.bin"))
//         .compile(&["proto/calculator.proto"], &["proto"])?;

//     tonic_build::compile_protos("proto/calculator.proto")?;

//     Ok(())
// }

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let out_dir = PathBuf::from(env::var("OUT_DIR").unwrap());
    tonic_prost_build::configure()
        // .build_server(false)
        .file_descriptor_set_path(out_dir.join("calculator_descriptor.bin"))
        //.out_dir("src/google")  // you can change the generated code's location
        .compile_protos(
            &["proto/calculator.proto"],
            &["proto/"], // specify the root location to search proto dependencies
        )?;
    Ok(())
}
