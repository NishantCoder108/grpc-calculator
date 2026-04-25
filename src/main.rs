use http::{HeaderValue, Method};
use proto::admin_server::{Admin, AdminServer};
use proto::calculator_server::{Calculator, CalculatorServer};
use tonic::transport::Server;
mod proto {
    tonic::include_proto!("calculator");

    pub(crate) const FILE_DESCRIPTOR_SET: &[u8] =
        tonic::include_file_descriptor_set!("calculator_descriptor");
}

type State = std::sync::Arc<tokio::sync::RwLock<u64>>;

#[derive(Debug, Default)]
struct CalculatorService {
    state: State,
}

impl CalculatorService {
    async fn increment_counter(&self) {
        let mut count = self.state.write().await;

        *count += 1;

        println!("Request count: {}", *count);
    }
}
#[tonic::async_trait]
impl Calculator for CalculatorService {
    async fn add(
        &self,
        request: tonic::Request<proto::CalculatorRequest>,
    ) -> Result<tonic::Response<proto::CalculatorResponse>, tonic::Status> {
        println!("got a request : {:?}", request);

        self.increment_counter().await;
        let input = request.get_ref();

        let response = proto::CalculatorResponse {
            result: input.a + input.b,
        };

        Ok(tonic::Response::new(response))
    }

    async fn divide(
        &self,
        request: tonic::Request<proto::CalculatorRequest>,
    ) -> Result<tonic::Response<proto::CalculatorResponse>, tonic::Status> {
        self.increment_counter().await;

        let input = request.get_ref();

        if input.b == 0 {
            return Err(tonic::Status::invalid_argument("Can't divide by 0"));
        }
        let response = proto::CalculatorResponse {
            result: input.a / input.b,
        };

        Ok(tonic::Response::new(response))
    }

    async fn subtract(
        &self,
        request: tonic::Request<proto::CalculatorRequest>,
    ) -> Result<tonic::Response<proto::CalculatorResponse>, tonic::Status> {
        self.increment_counter().await;

        let input = request.get_ref();

        let response = proto::CalculatorResponse {
            result: input.a - input.b,
        };
        Ok(tonic::Response::new(response))
    }

    async fn multiply(
        &self,
        request: tonic::Request<proto::CalculatorRequest>,
    ) -> Result<tonic::Response<proto::CalculatorResponse>, tonic::Status> {
        self.increment_counter().await;

        let input = request.get_ref();
        let response = proto::CalculatorResponse {
            result: input.a * input.b,
        };

        Ok(tonic::Response::new(response))
    }
}

#[derive(Default, Debug)]
struct AdminService {
    state: State,
}

#[tonic::async_trait]
impl Admin for AdminService {
    async fn get_request_count(
        &self,
        _request: tonic::Request<proto::GetCountRequest>,
    ) -> Result<tonic::Response<proto::CounterResponse>, tonic::Status> {
        let count = self.state.read().await;
        let response = proto::CounterResponse { count: *count };

        Ok(tonic::Response::new(response))
    }
}

use tonic::metadata::MetadataValue;
use tonic::{Request, Status};
use tonic_web::GrpcWebLayer;
use tower_http::cors::{Any, CorsLayer};

fn check_auth(req: Request<()>) -> Result<Request<()>, Status> {
    let token: MetadataValue<_> = "Bearer some-secret-token".parse().unwrap();

    match req.metadata().get("authorization") {
        Some(t) if token == t => Ok(req),
        _ => Err(Status::unauthenticated("no valid auth token")),
    }
}
#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let addr = "[::1]:50051".parse()?;

    let state = State::default();
    let calc = CalculatorService {
        state: state.clone(),
    };
    let admin = AdminService {
        state: state.clone(),
    };

    let service = tonic_reflection::server::Builder::configure()
        .register_encoded_file_descriptor_set(proto::FILE_DESCRIPTOR_SET)
        .build_v1()?;

    Server::builder()
        .accept_http1(true)
        .layer(
            CorsLayer::new()
                .allow_origin(HeaderValue::from_static("http://localhost:5173"))
                .allow_methods(Method::POST)
                .allow_headers(Any),
        )
        .layer(GrpcWebLayer::new())
        .add_service(service)
        .add_service(CalculatorServer::new(calc))
        // .add_service(AdminServer::new(admin))
        .add_service(AdminServer::with_interceptor(admin, check_auth))
        .serve(addr)
        .await?;

    println!("Running at address: {:?}", addr);

    Ok(())
}
