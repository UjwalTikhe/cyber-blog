import type { Post, JourneyMilestone, ArsenalTool } from '../types';

export const INITIAL_POSTS: Post[] = [
  {
    id: 'day-1-embarking-on-cybersecurity-roadmap',
    episode: 1,
    title: 'Day 1: Embarking on My Cybersecurity Journey — Roadmap & Philosophy',
    date: '2026-10-05',
    category: 'Foundations',
    difficulty: 'Beginner',
    readTime: '5 min read',
    thumbnailUrl: './thumbnails/thumb-ep1.svg',
    feynmanSummary: 'Certifications without hands-on proof of work are meaningless. Documenting my journey using the Feynman Technique forces me to truly understand core cybersecurity protocols instead of just memorizing slides.',
    tags: ['journey', 'roadmap', 'foundations', 'learning-in-public'],
    excerpt: 'Why I am committing to documenting every lab, failure, and breakthrough publicly. The 100-day strategy, certification milestones, and my initial tool setup.',
    content: `# Day 1: Embarking on My Cybersecurity Journey — Roadmap & Philosophy

Welcome to the inaugural transmission of my cybersecurity logbook. Today marks **Day 1** of a deliberate, multi-month transition into the world of offensive and defensive information security.

I decided early on that passively reading textbooks or hoarding certification PDF guides wouldn't cut it. In security, **proof of work speaks louder than credentials alone**. This blog is my public ledger: documenting the labs I break, the tools I build, the traffic I dissect, and the lessons I learn along the way.

---

## 1. The Core Philosophy: "Learn in Public"

> **"If you cannot explain a vulnerability, network packet, or defensive control in plain English, you do not truly understand it."**

By writing walkthroughs for every substantial lab, I enforce the *Feynman Technique*. Every article here will satisfy three rules:
1. **Explain the "Why":** Not just running commands, but understanding the underlying protocol or operating system mechanism.
2. **Include Proof:** Terminal outputs, Wireshark captures, or architecture diagrams.
3. **Offer Defense & Remediation:** For every exploit explored, detail how blue teams detect and mitigate it.

---

## 2. The 100-Day Strategic Roadmap

Here is how I have structured the upcoming 100 days across 4 progressive sprints:

\`\`\`
Sprint 1: Foundations (Days 1–25)
├── Computer Networking (OSI, TCP/IP, DNS, DHCP, Subnetting)
├── Linux & Bash Command-Line Mastery
└── Virtualization & Homelab Isolation

Sprint 2: Offensive Recon & Defense Fundamentals (Days 26–50)
├── Nmap, Wireshark & Packet Dissection
├── Web Application Security (OWASP Top 10)
└── TryHackMe Pre-Security & Complete Beginner Paths

Sprint 3: Blue Team Operations & SIEM (Days 51–75)
├── Security Information and Event Management (Splunk / Elastic)
├── Active Directory Fundamentals & Attack Vectors (Kerberos, NTLM)
└── Snort / Suricata Intrusion Detection Rules

Sprint 4: Hands-on Penetration Testing & Capstone (Days 76–100)
├── HackTheBox Starting Point & Easy Machines
├── Python Security Automation & Port Scanners
└── Certification Preparation (CompTIA Security+ / eJPT)
\`\`\`

---

## 3. Ground Rules & Ethics Disclaimer

> [!NOTE]
> All security exercises, vulnerability analyses, and penetration tests recorded in this log are conducted strictly within **isolated local virtual labs**, sanctioned sandbox environments (TryHackMe, HackTheBox), or authorized systems.

* **Never target unauthorized infrastructure.**
* **Never store live credentials or sensitive operational data on public repositories.**
* **Always verify host-only virtual network isolation before launching test traffic.**

---

## 4. Next Steps for Day 2

Tomorrow, I will be setting up my primary battlefield: an isolated **VirtualBox & Kali Linux homelab** with custom Host-Only networking to safely simulate client-server architectures without exposing my home LAN.

*Stay tuned, and feel free to connect with me if you are walking a similar path!*
`
  },
  {
    id: 'homelab-setup-virtualbox-kali-pfsense',
    episode: 2,
    title: 'Day 2: Architecting an Isolated VirtualBox & Kali Homelab',
    date: '2026-10-06',
    category: 'Homelab',
    difficulty: 'Beginner',
    readTime: '7 min read',
    thumbnailUrl: './thumbnails/thumb-ep2.svg',
    feynmanSummary: 'A safe lab is like a digital submarine with watertight bulkheads: the attacker VM has an outside valve to download tools from the internet, but vulnerable victim machines are locked in an airtight room so malware can never escape into your real house network.',
    tags: ['homelab', 'virtualbox', 'kali-linux', 'networking', 'security'],
    excerpt: 'Step-by-step guide to designing a dual-adapter sandbox environment: keeping your attack machine connected for updates while completely isolating vulnerable targets.',
    content: `# Day 2: Architecting an Isolated VirtualBox & Kali Homelab

A safe, reproducible testing ground is the fundamental prerequisite of every cybersecurity practitioner. Practicing with offensive tools like Nmap, Metasploit, or Hydra on your home Wi-Fi network risks crashing your router, triggering ISP alerts, or accidentally exposing your host OS.

Today, I designed and deployed an **air-gapped target subnet** paired with a dual-homed Kali Linux machine.

---

## 1. Network Architecture Diagram

The goal is simple: Kali needs internet access to download tools and apt packages, but the vulnerable targets (e.g., Metasploitable 2 or Windows 10 victim) must **never** be able to communicate with the outside internet or my physical local network.

\`\`\`
Physical Host (Windows 11 / 32GB RAM)
│
├── [NAT Network: 10.0.2.0/24] ─── (Outbound Internet for Updates)
│         │
│     [Adapter 1]
│   ┌──────────────┐
│   │  Kali Linux  │ (Attacker VM)
│   └──────────────┘
│     [Adapter 2]
│         │
└── [Host-Only / Internal: 192.168.56.0/24] ─── (Isolated Private Lab)
          │
          ├── [Metasploitable 2 Target: 192.168.56.101]
          └── [Windows 10 Test Target:  192.168.56.102]
\`\`\`

---

## 2. Step-by-Step Configuration

### Step 2.1: Configuring Kali Network Adapters
Inside VirtualBox settings for Kali Linux:
1. **Adapter 1:** Attached to \`NAT\` (Allows web browsing and \`sudo apt update\`).
2. **Adapter 2:** Attached to \`Host-Only Adapter\` (\`vboxnet0\` or \`VirtualBox Host-Only Ethernet Adapter\`).
   - Promiscuous Mode: *Allow All* (essential for Wireshark packet captures).

### Step 2.2: Isolating the Target VMs
For every vulnerable victim VM:
* Enable **only one adapter**, attached strictly to the same \`Host-Only Adapter\` or \`Internal Network\`.
* Turn off DHCP if you prefer assigning deterministic static IPs for your targets.

---

## 3. Verification & Safety Checks

Once booted, let's verify Kali's routing table:

\`\`\`bash
# Check interface assignments
ip addr show

# Verify default gateway points to NAT adapter (eth0), NOT the lab subnet
ip route show
\`\`\`

Expected output:
\`\`\`text
default via 10.0.2.1 dev eth0 proto dhcp metric 100 
10.0.2.0/24 dev eth0 proto kernel scope link src 10.0.2.15 
192.168.56.0/24 dev eth1 proto kernel scope link src 192.168.56.10 
\`\`\`

Now test connectivity:
\`\`\`bash
# 1. Test Internet Outbound
ping -c 2 1.1.1.1
# Output: 2 packets transmitted, 2 received, 0% packet loss (PASS)

# 2. Test Target Discovery on Isolated Subnet
sudo arp-scan --interface=eth1 192.168.56.0/24
\`\`\`

> [!FLAG]
> Target Discovered: \`192.168.56.101\` responded with OUI matching VMware/VirtualBox. The target is live and reachable only from Kali.

---

## 4. Snapshot Best Practice

> [!WARNING]
> Always take a **clean baseline snapshot** of your VM *before* running any exploits or altering configuration files. 

If an exploit corrupts the file system or a service crashes irreversibly, you can revert state within 3 seconds using:
\`\`\`powershell
# VirtualBox CLI snapshot restore
VBoxManage snapshot "Metasploitable2" restore "Clean-Install"
\`\`\`

Tomorrow, we fire up Nmap and dissect how TCP handshakes look when scanned with different flag combinations!
`
  },
  {
    id: 'tryhackme-pre-security-and-nmap-basics',
    episode: 3,
    title: 'Day 3: Demystifying the TCP 3-Way Handshake & Nmap Scanning Internals',
    date: '2026-10-07',
    category: 'Networking',
    difficulty: 'Intermediate',
    readTime: '8 min read',
    thumbnailUrl: './thumbnails/thumb-ep3.svg',
    feynmanSummary: "TCP is like a polite phone call: 'Hello can you hear me?' (SYN), 'Yes, can you hear me?' (SYN-ACK), 'Yes, connection active!' (ACK). Stealth Nmap scans hang up the phone right before the last sentence with RST so legacy firewalls never log that a connection took place.",
    tags: ['nmap', 'networking', 'tcp-ip', 'wireshark', 'recon'],
    excerpt: 'What actually happens at the packet level during an Nmap scan? Comparing TCP Connect (-sT) vs Stealth SYN (-sS) scans through raw Wireshark frames.',
    content: `# Day 3: Demystifying the TCP 3-Way Handshake & Nmap Scanning Internals

When most people start using Nmap, they blindly memorize commands: \`nmap -sC -sV -p- <target>\`. But what is actually travelling across the wire? How does a port know whether it's open, closed, or filtered?

Today, I inspected Nmap scanning techniques by capturing the raw Ethernet frames in Wireshark.

---

## 1. Refresh: The TCP 3-Way Handshake

Under standard network communication, two machines establish a reliable stream through three distinct packets:

\`\`\`
Client (Initiator)                 Server (Listener)
        │                                  │
        │─── [SYN: Seq = 100] ────────────>│  (1. Client requests connection)
        │                                  │
        │<── [SYN-ACK: Seq=500, Ack=101] ──│  (2. Server acknowledges & agrees)
        │                                  │
        │─── [ACK: Seq = 101, Ack=501] ───>│  (3. Connection Established!)
        │                                  │
\`\`\`

---

## 2. Full Connect Scan (\`-sT\`) vs. Stealth SYN Scan (\`-sS\`)

### Mode A: TCP Connect Scan (\`nmap -sT\`)
* Performs the complete 3-way handshake.
* Uses the OS \`connect()\` syscall.
* **Downside:** Easily logged by application-level firewalls and web servers because the TCP session was fully established.

### Mode B: TCP SYN / Half-Open Scan (\`nmap -sS\`)
* The de-facto default for root users.
* Sends \`SYN\`. If the server responds with \`SYN-ACK\` (indicating open port), Nmap immediately responds with a **\`RST\` (Reset)** flag instead of the final \`ACK\`!
* Because the handshake is never completed, old legacy loggers never record a session.

\`\`\`
Attacker (Nmap -sS)                 Target Server (Port 80 OPEN)
        │                                  │
        │─── [SYN] ───────────────────────>│
        │<── [SYN-ACK] ────────────────────│  (Port is OPEN!)
        │─── [RST] ───────────────────────>│  (Tears down connection instantly)
\`\`\`

---

## 3. Hands-on Experiment in the Lab

Let's test this against our lab machine:

\`\`\`bash
# 1. Run SYN scan against target HTTP port while capturing packets
sudo nmap -sS -p 80,443,22 192.168.56.101 --packet-trace
\`\`\`

### Terminal Trace Output:
\`\`\`text
SENT (0.0410s) TCP 192.168.56.10:48231 > 192.168.56.101:80 S ttl=48 id=25121
RCVD (0.0414s) TCP 192.168.56.101:80 > 192.168.56.10:48231 SA ttl=64 id=0
SENT (0.0415s) TCP 192.168.56.10:48231 > 192.168.56.101:80 R ttl=53 id=61823

PORT   STATE SERVICE
22/tcp open  ssh
80/tcp open  http
443/tcp closed https
\`\`\`

Notice the flags:
* \`S\` = SYN sent
* \`SA\` = SYN-ACK received
* \`R\` = RST sent by Nmap to break the circuit

---

## 4. Blue Team Defense: How to Detect SYN Port Scans

How does a modern IDS (like Snort or Suricata) flag this?

A basic Snort rule checks for a high rate of incoming TCP packets with only the SYN flag set that terminate with RST:

\`\`\`snort
# Sample Snort rule pattern
alert tcp any any -> $HOME_NET any (msg:"SCAN Potential Nmap SYN Stealth Scan Detected"; flags:S; threshold:type both, track by_src, count 20, seconds 5; sid:1000001; rev:1;)
\`\`\`

> [!INTEL]
> Next up: We will deploy an Apache web service and write our first Python port scanner from scratch using the raw \`socket\` module.
`
  }
];

export const INITIAL_MILESTONES: JourneyMilestone[] = [
  {
    day: 1,
    title: 'Mission Launch & 100-Day Strategy',
    phase: 'Phase 1: Foundations',
    status: 'completed',
    description: 'Set up public portfolio blog, defined roadmap, ethical guidelines, and learning goals.',
    relatedPostId: 'day-1-embarking-on-cybersecurity-roadmap',
    dateTarget: 'Day 1'
  },
  {
    day: 2,
    title: 'Isolated Virtualization & Dual-NIC Sandbox',
    phase: 'Phase 1: Foundations',
    status: 'completed',
    description: 'Configured VirtualBox, Host-Only networking, Kali Linux attacker VM, and snapshot automation.',
    relatedPostId: 'homelab-setup-virtualbox-kali-pfsense',
    dateTarget: 'Day 2'
  },
  {
    day: 3,
    title: 'TCP/IP Internals & Packet-Level Port Scans',
    phase: 'Phase 1: Foundations',
    status: 'completed',
    description: 'Captured SYN vs Connect scans in Wireshark, decoded flag states, and documented IDS signatures.',
    relatedPostId: 'tryhackme-pre-security-and-nmap-basics',
    dateTarget: 'Day 3'
  },
  {
    day: 10,
    title: 'Linux Privilege Escalation Fundamentals',
    phase: 'Phase 1: Foundations',
    status: 'in-progress',
    description: 'Investigating SUID bits, sudo permissions, crontab misconfigurations, and LinPEAS enumeration.',
    dateTarget: 'Target: Day 10'
  },
  {
    day: 25,
    title: 'TryHackMe Pre-Security & Complete Beginner Path',
    phase: 'Phase 2: Offensive & Defensive Labs',
    status: 'upcoming',
    description: 'Completing 35+ guided interactive rooms covering Web, Network, and Endpoint security basics.',
    dateTarget: 'Target: Day 25'
  },
  {
    day: 50,
    title: 'Active Directory Attack & Defense Homelab',
    phase: 'Phase 3: Enterprise Security',
    status: 'upcoming',
    description: 'Deploying Windows Server 2022 domain controller, BloodHound mapping, and Kerberoasting mitigation.',
    dateTarget: 'Target: Day 50'
  },
  {
    day: 75,
    title: 'SIEM Log Ingestion with Splunk & Elastic',
    phase: 'Phase 3: Enterprise Security',
    status: 'upcoming',
    description: 'Analyzing Sysmon event logs, detecting lateral movement, and writing alert correlations.',
    dateTarget: 'Target: Day 75'
  },
  {
    day: 100,
    title: 'Capstone: 10 Rooted HTB Machines & CompTIA Sec+',
    phase: 'Phase 4: Industry Readiness',
    status: 'upcoming',
    description: 'Comprehensive public portfolio showcase of 10 CTF walkthroughs and Security+ certification credential.',
    dateTarget: 'Target: Day 100'
  }
];

export const INITIAL_ARSENAL: ArsenalTool[] = [
  {
    name: 'Kali Linux 2026.x',
    category: 'Virtualization & OS',
    purpose: 'Primary security auditing & penetration testing workstation',
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
    purpose: 'Host discovery, port scanning, service versioning, and NSE vulnerability scripts',
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
    name: 'Python 3 (Security Scripts)',
    category: 'Scripting & Automation',
    purpose: 'Building custom port scanners, banner grabbers, and log parsers',
    status: 'Currently Studying',
    commandExample: 'python3 -m pip install scapy requests cryptography'
  }
];
