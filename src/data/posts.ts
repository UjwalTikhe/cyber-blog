import type { Post, JourneyMilestone, ArsenalTool } from '../types';

export const INITIAL_POSTS: Post[] = [
  {
    id: 'akte-001-philosophy-of-proof-of-work',
    akteNumber: 1,
    episode: 1,
    title: 'Akte 001: The Philosophy of Proof-of-Work in Cybersecurity',
    date: '2026-10-05',
    category: 'Foundations',
    difficulty: 'Beginner',
    readTime: '5 min read',
    thumbnailUrl: './thumbnails/thumb-ep1.svg',
    feynmanSummary: 'Theoretical cybersecurity knowledge without verifiable proof-of-work is fragile. Breaking down every protocol and attack vector into reproducible simulations ensures true mastery over memorization.',
    tags: ['foundations', 'methodology', 'learning-in-public', 'architecture'],
    excerpt: 'An investigation into verifiable technical competency, disciplined lab logging, and applying the Feynman Technique across 511 technical dossiers.',
    content: `# Akte 001: The Philosophy of Proof-of-Work in Cybersecurity

In information security, credentials and certifications represent intent, but **reproducible proof-of-work represents capability**. 

Passive reading and memorization of slide decks often dissolve when faced with an active security incident, an unexpected firewall state, or an unstandardized network topography. **Akte 511** is established as an immutable technical ledger: documenting isolated lab simulations, packet-level telemetry, offensive vectors, and blue-team mitigations across 511 case records.

---

## 1. The Core Method: First Principles & Feynman Breakdown

Every technical record in this series adheres to three core standards:

1. **Protocol-Level Understanding:** Rather than blindly executing exploitation frameworks, dissect the underlying protocol mechanism (e.g. TCP flags, RPC handshakes, memory allocations).
2. **Empirical Evidence:** Walkthroughs require packet captures, raw terminal traces, and verified system logs.
3. **Defensive Remediation:** An offensive vector is only half-understood until the blue-team detection signature and hardening configuration are fully documented.

---

## 2. Lab Isolation & Operational Security Standards

All investigative procedures in this series follow strict containment protocols:

> [!NOTE]
> All vulnerability assessments, packet inspections, and exploit executions are performed strictly within isolated, non-routable virtual environments or sanctioned lab infrastructure.

* **Dual-NIC Isolation:** Virtual machines conducting active testing are assigned host-only subnets with zero default gateways to public networks.
* **Ephemeral Snapshots:** Hypervisor states are snapshotted prior to any artifact execution to prevent configuration drift.
* **Deterministic Logging:** Command invocations and stdout/stderr are preserved for post-mortem analysis.

---

## 3. Dossier Trajectory

The upcoming dossiers establish the foundational infrastructure: configuring a fully segmented hypervisor sandbox, dissecting packet headers at the datalink layer, and constructing customized Python socket monitors.
`
  },
  {
    id: 'akte-002-isolated-hypervisor-sandbox',
    akteNumber: 2,
    episode: 2,
    title: 'Akte 002: Architecting an Isolated Hypervisor & Dual-NIC Sandbox',
    date: '2026-10-06',
    category: 'Homelab',
    difficulty: 'Beginner',
    readTime: '7 min read',
    thumbnailUrl: './thumbnails/thumb-ep2.svg',
    feynmanSummary: 'A safe lab functions like a containment submarine with isolated airlocks: the auditing machine can reach outside to pull necessary tool updates, but target machines reside in an airtight subnet where packets can never reach physical home devices.',
    tags: ['homelab', 'virtualbox', 'kali-linux', 'networking', 'isolation'],
    excerpt: 'Engineering a zero-leakage testing ground: dual-adapter network segmentation, host-only subnets, and hypervisor baseline snapshots.',
    content: `# Akte 002: Architecting an Isolated Hypervisor & Dual-NIC Sandbox

Practicing security auditing tools across consumer networks carries unacceptable risks: broadcast flooding, router instability, and potential exposure of sensitive local traffic. 

This dossier outlines the architecture of an isolated testing environment using **VirtualBox 7.x**, **Kali Linux**, and a dedicated **Host-Only virtual subnet**.

---

## 1. Network Topology & Interface Architecture

To balance utility with containment, the primary security workstation utilizes dual network interfaces:

\`\`\`
                    [ Host Physical Wi-Fi / LAN ]
                                 │
                     NAT Adapter (enp0s3)
                  [Internet Access for Updates]
                                 │
                   ┌─────────────┴─────────────┐
                   │    Kali Workstation VM    │
                   └─────────────┬─────────────┘
                                 │
                     Host-Only Adapter (enp0s8)
                       Subnet: 192.168.56.0/24
                                 │
         ┌───────────────────────┴───────────────────────┐
         │                                               │
┌─────────────────┐                             ┌─────────────────┐
│ Target VM 1     │                             │ Target VM 2     │
│ IP: .101        │                             │ IP: .102        │
│ Gateway: NONE   │                             │ Gateway: NONE   │
└─────────────────┘                             └─────────────────┘
\`\`\`

---

## 2. Interface Configuration Protocol

In the Kali VM, \`/etc/network/interfaces\` or NetworkManager is configured with deterministic addressing:

\`\`\`bash
# Identify assigned interfaces
ip -brief address show

# Verify Host-Only interface assignment
sudo ip addr add 192.168.56.10/24 dev eth1
sudo ip link set eth1 up
\`\`\`

> [!NOTE]
> Target victim machines must never have an active NAT or Bridged interface attached. Verify that \`ip route\` on victim nodes returns no default gateway to avoid unintended outbound connections.

---

## 3. Snapshot Baseline Automation

Before executing testing on target instances, clean state snapshots ensure rapid recovery:

\`\`\`bash
# Create baseline snapshot via CLI
VBoxManage snapshot "Kali-Security-Station" take "Baseline-Clean-v1" --description "Post-update pristine state"
\`\`\`
`
  },
  {
    id: 'akte-003-tcp-handshake-packet-forensics',
    akteNumber: 3,
    episode: 3,
    title: 'Akte 003: TCP 3-Way Handshake Internals & Stealth Packet Forensics',
    date: '2026-10-07',
    category: 'Networking',
    difficulty: 'Intermediate',
    readTime: '8 min read',
    thumbnailUrl: './thumbnails/thumb-ep3.svg',
    feynmanSummary: 'TCP connection establishment operates like certified mail: Sender sends SYN (Hello), Receiver returns SYN-ACK (Heard you, hello back), Sender confirms with ACK (Acknowledged). A stealth scan stops halfway by sending RST instead of final ACK so the target never logs an established session.',
    tags: ['networking', 'wireshark', 'nmap', 'tcp-ip', 'forensics'],
    excerpt: 'Analyzing the mechanics of TCP SYN vs Full Connect scanning through raw Wireshark packet captures and intrusion detection signatures.',
    content: `# Akte 003: TCP 3-Way Handshake Internals & Stealth Packet Forensics

Port scanning is the primary phase of network reconnaissance. Understanding the exact transport-layer packet exchanges differentiates a surface-level operator from a disciplined network analyst.

---

## 1. Transmission Control Protocol: The 3-Way Handshake

Every standard TCP stream relies on explicit flag state coordination:

\`\`\`
Client (Initiator)                       Server (Listener)
        │                                        │
        │ ────────────── SYN (Seq=x) ──────────> │ [Port Listening]
        │                                        │
        │ <─────── SYN-ACK (Seq=y, Ack=x+1) ──── │
        │                                        │
        │ ────────────── ACK (Ack=y+1) ────────> │ [Connection ESTABLISHED]
\`\`\`

---

## 2. SYN Stealth Scan (\`nmap -sS\`) vs Full Connect (\`nmap -sT\`)

### SYN Stealth Scan Mechanics
1. Client transmits a \`SYN\` packet to target port 80.
2. If open, server replies with \`SYN-ACK\`.
3. Client immediately responds with a \`RST\` (Reset) flag instead of the concluding \`ACK\`.
4. **Result:** The target OS does not hand the connection to the application layer, preventing connection logging in legacy daemons.

\`\`\`bash
# Execute privileged half-open SYN scan
sudo nmap -sS -p 21,22,80,443 -n --packet-trace 192.168.56.101
\`\`\`

---

## 3. Wireshark Capture Filter & Packet Analysis

To observe raw frames in real time:

\`\`\`bash
# Capture exclusively TCP flags on the Host-Only interface
tshark -i eth1 -Y "tcp.flags.syn == 1" -T fields -e ip.src -e ip.dst -e tcp.dstport -e tcp.flags.str
\`\`\`

> [!NOTE]
> Modern intrusion detection systems (Snort, Suricata, Zeek) easily detect high-frequency half-open SYN scans through packet rate anomaly heuristics and incomplete session thresholds.
`
  }
];

export const INITIAL_MILESTONES: JourneyMilestone[] = [
  {
    akteRange: 'Akte 001 - 050',
    title: 'Core Protocols, Systems & Lab Isolation',
    phase: 'Phase 1: Foundations',
    status: 'in-progress',
    description: 'Computer networking primitives, Linux systems programming, air-gapped virtualization architectures, and packet analysis.',
    relatedPostId: 'akte-001-philosophy-of-proof-of-work'
  },
  {
    akteRange: 'Akte 051 - 150',
    title: 'Offensive Reconnaissance & Target Mapping',
    phase: 'Phase 2: Network & Surface Enumeration',
    status: 'upcoming',
    description: 'Active/passive network mapping, port scanning internals, service banner extraction, and automated vulnerability scanning.'
  },
  {
    akteRange: 'Akte 151 - 250',
    title: 'Web Application Auditing & Vulnerability Mechanics',
    phase: 'Phase 3: Application Security',
    status: 'upcoming',
    description: 'OWASP Top 10 vulnerabilities, authentication bypasses, SQL injection mechanics, and API security auditing.'
  },
  {
    akteRange: 'Akte 251 - 380',
    title: 'Enterprise Active Directory & Privilege Escalation',
    phase: 'Phase 4: Enterprise Infrastructure',
    status: 'upcoming',
    description: 'Windows domain controllers, Kerberos ticket manipulation, BloodHound graph analysis, and defensive Group Policy hardening.'
  },
  {
    akteRange: 'Akte 381 - 460',
    title: 'Incident Response, SIEM Forensics & Threat Hunting',
    phase: 'Phase 5: Blue Team Operations',
    status: 'upcoming',
    description: 'Splunk and Elastic log pipelines, memory dump analysis with Volatility, and custom Suricata detection rules.'
  },
  {
    akteRange: 'Akte 461 - 511',
    title: 'Advanced Exploit Mechanics & Defense Architecture',
    phase: 'Phase 6: Mastery & Synthesis',
    status: 'upcoming',
    description: 'Buffer overflow primitives, binary analysis, custom command & control emulation, and comprehensive capstone writeups.'
  }
];

export const INITIAL_ARSENAL: ArsenalTool[] = [
  {
    name: 'Kali Linux 2026.x',
    category: 'Virtualization & OS',
    purpose: 'Security auditing & penetration testing workstation',
    status: 'Daily Driver',
    commandExample: 'sudo apt update && sudo apt dist-upgrade'
  },
  {
    name: 'Oracle VM VirtualBox',
    category: 'Virtualization & OS',
    purpose: 'Type-2 hypervisor hosting air-gapped lab subnets and victim targets',
    status: 'Daily Driver',
    commandExample: 'VBoxManage list runningvms'
  },
  {
    name: 'Wireshark & Tshark',
    category: 'Network Analysis',
    purpose: 'Deep packet inspection and protocol header dissection',
    status: 'Active Lab',
    commandExample: 'tshark -i eth1 -Y "tcp.flags.syn==1 and tcp.flags.ack==0"'
  },
  {
    name: 'Nmap (Network Mapper)',
    category: 'Penetration Testing',
    purpose: 'Host discovery, port scanning, service versioning, and NSE scripts',
    status: 'Daily Driver',
    commandExample: 'nmap -sC -sV -O -p- 192.168.56.101 -oN scan.txt'
  },
  {
    name: 'Burp Suite Community',
    category: 'Penetration Testing',
    purpose: 'HTTP proxy for intercepting and manipulating web application requests',
    status: 'Active Lab',
    commandExample: 'Proxy running on 127.0.0.1:8080 with CA Certificate imported'
  },
  {
    name: 'Python 3 (Security Tooling)',
    category: 'Scripting & Automation',
    purpose: 'Custom socket monitors, banner grabbers, and log parsers',
    status: 'Currently Studying',
    commandExample: 'python3 -m pip install scapy requests cryptography'
  }
];
