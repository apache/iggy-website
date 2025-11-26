import type { ReactNode } from "react";
import clsx from "clsx";
import Heading from "@theme/Heading";
import styles from "./styles.module.css";

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<"svg">>;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: "Extremely Efficient",
    Svg: require("@site/static/img/ExtremelyEfficient.svg").default,
    description: (
      <>
        Rust language guarantees the predictable resources' usage, thus, you no
        longer need to worry about a random GC spikes.
      </>
    ),
  },
  {
    title: "Multiple Transports",
    Svg: require("@site/static/img/MultipleTransports.svg").default,
    description: (
      <>
        TCP, QUIC, HTTP, or maybe all of them at once? Easily configure and
        enable the different transport protocols.
      </>
    ),
  },
  {
    title: "Advanced Features",
    Svg: require("@site/static/img/AdvancedFeatures.svg").default,
    description: (
      <>
        Users, partitioning, consumer groups, message deduplication, retention
        policy, data encryption and many more.
      </>
    ),
  },
  {
    title: "SDK Support",
    Svg: require("@site/static/img/Sdk.svg").default,
    description: (
      <>
        Building the distributed systems might involve many programming
        languages, which is why, we provide different SDKs.
      </>
    ),
  },
  {
    title: "Management Interface",
    Svg: require("@site/static/img/ManagementInterface.svg").default,
    description: (
      <>
        Built-in terminal CLI to manage the streaming server, or maybe the
        modern Web UI? Why not both :)
      </>
    ),
  },
  {
    title: "Fully Open-Source",
    Svg: require("@site/static/img/FullyOpenSourced.svg").default,
    description: (
      <>
        Thanks to the power of community, we can constantly improve Apache Iggy
        and support multiple programming languages SDKs.
      </>
    ),
  },
];

function Feature({ title, Svg, description }: FeatureItem) {
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export function HomepageFeaturesOld(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <div className="build-for-performance">
      <div className="container">
        <div className="wrapper-m">
          <div className="section-title centered">
            <div className="tagline hidden">Get SystemFlow</div>
            <h2 className="heading l">
              Built for <span className="c-t-primary-60">performance</span>
            </h2>
            <p className="body-text m">
              Apache Iggy (Incubating) is designed from the ground up to deliver{" "}
              <span className="text-span">
                exceptional performance, reliability, and developer experience
              </span>{" "}
              for modern message streaming workloads. Combined with{" "}
              <span className="text-span">
                io_uring and thread-per-core, shared nothing architecture
              </span>{" "}
              for maximum speed and efficiency.
            </p>
          </div>
          <div className="w-layout-grid l-g-4-col features">
            <div className="feature-block tile-up">
              {/* <div className="material-icons feature-icon-small">bolt</div> */}
              <h3 className="heading xxs">
                Ultra-High Performance
                <br />
              </h3>
              <p className="body-text s feature">
                Process millions of messages per second with predictable low
                latency thanks to Rust, combined with io_uring and
                thread-per-core, shared nothing architecture.
                <br />
              </p>
            </div>
            <div className="feature-block tile-up">
              {/* <div className="material-icons feature-icon-small">cloud_sync</div> */}
              <h3 className="heading xxs">Zero-Copy Serialization</h3>
              <p className="body-text s">
                Custom zero-copy (de)serialization for improved performance and
                reduced memory usage, working directly with binary data.
                <br />
                <br />
              </p>
            </div>
            <div className="feature-block tile-up">
              {/* <div className="material-icons feature-icon-small">dns</div> */}
              <h3 className="heading xxs">
                Multiple Transport Protocols
                <br />
              </h3>
              <p className="body-text s">
                Support for QUIC, TCP, WebSocket, and HTTP protocols with TLS
                encryption, giving you flexibility in how clients connect.
              </p>
            </div>
            <div className="feature-block tile-up">
              {/* <div className="material-icons feature-icon-small">code</div> */}
              <h3 className="heading xxs">
                Multi-Language SDKs
                <br />
              </h3>
              <p className="body-text s">
                Client libraries available for Rust, C#, Java, Go, Python and
                Node.js with more languages coming for best developer
                experience.
                <br />
              </p>
            </div>
            <div className="feature-block tile-down first">
              {/* <div className="material-icons feature-icon-small">group</div> */}
              <h3 className="heading xxs">
                Consumer Groups &amp; Partitioning
                <br />
              </h3>
              <p className="body-text s">
                Built-in support for consumer groups, partitioning, and
                horizontal scaling across connected clients.
                <br />
              </p>
            </div>
            <div className="feature-block tile-down">
              {/* <div className="material-icons feature-icon-small">verified_user</div> */}
              <h3 className="heading xxs">
                Security &amp; Authentication
                <br />
              </h3>
              <p className="body-text s">
                User authentication and authorization with granular permissions,
                Personal Access Tokens, and optional data encryption.
                <br />‍<br />
              </p>
            </div>
            <div className="feature-block tile-down">
              {/* <div className="material-icons feature-icon-small">network_check</div> */}
              <h3 className="heading xxs">
                Built-in Monitoring
                <br />
              </h3>
              <p className="body-text s">
                OpenTelemetry logs &amp; traces, Prometheus metrics, and
                built-in benchmarking tools for performance monitoring.
                <br />
              </p>
            </div>
            <div
              id="w-node-_94c4313e-fb50-e882-0de0-ff04e3b099bb-3bca6c21"
              className="feature-block tile-down"
            >
              {/* <div className="material-icons feature-icon-small">account_tree</div> */}
              <h3 className="heading xxs">
                Multi-Tenant Support
                <br />
              </h3>
              <p className="body-text s">
                Stream abstraction for multi-tenancy, message retention
                policies, and S3-compatible backup storage.
                <br />
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
