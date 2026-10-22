from datetime import datetime, timezone
from typing import Dict, List, Optional
from app.schemas.case import Case, CaseSummary
from app.schemas.entity import Entity
from app.schemas.incident import Incident
from app.schemas.evidence import Evidence, CustodyEntry
from app.schemas.relationship import Relationship
from app.schemas.hypothesis import Hypothesis
from app.schemas.timeline import TimelineEvent
from app.schemas.dashboard import DashboardSummary, EpistemicBreakdown


class CanonicalSyntheticStore:
    """
    Canonical, in-memory synthetic intelligence repository.
    Enforces that all analytical modules, future graphs, maps, and AI copilots
    draw from a single, referentially-sound source of synthetic truth.
    All data is clearly tagged as synthetic demonstration data.
    """

    def __init__(self):
        self._cases: Dict[str, Case] = {}
        self._entities: Dict[str, Entity] = {}
        self._incidents: Dict[str, Incident] = {}
        self._evidence: Dict[str, Evidence] = {}
        self._relationships: Dict[str, Relationship] = {}
        self._timeline: Dict[str, TimelineEvent] = {}
        self._hypotheses: Dict[str, Hypothesis] = {}
        self._load_synthetic_baseline()

    def _load_synthetic_baseline(self) -> None:
        """Initialize verified synthetic demonstration cases, entities, evidence, and leads."""

        # ----------------------------------------------------------------------
        # EVIDENCE RECORDS (6 items)
        # ----------------------------------------------------------------------
        evd_001 = Evidence(
            id="EVD-001",
            case_id="CASE-001",
            title="CCTV Video Feed - Telemetry Cabin Entry 04",
            evidence_type="digital_video",
            source="AeroGrid North Substation Physical Security Array",
            collected_at=datetime(2026, 3, 14, 6, 0, 0, tzinfo=timezone.utc),
            chain_of_custody=[
                CustodyEntry(
                    timestamp=datetime(2026, 3, 14, 6, 15, 0, tzinfo=timezone.utc),
                    custodian="Security Inspector M. Davies (ID: SEC-8891)",
                    action="Extracted raw MP4 stream from local NVR; computed SHA-256 seal"
                ),
                CustodyEntry(
                    timestamp=datetime(2026, 3, 14, 8, 30, 0, tzinfo=timezone.utc),
                    custodian="Forensic Analyst R. Patel (ID: FA-104)",
                    action="Ingested into evidence locker; verified bitstream integrity"
                )
            ],
            checksum="sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069",
            confidence_score=0.98,
            summary="High-definition video showing an individual in dark coveralls using a cloned RFID credential at door 04 at 02:41:09 UTC.",
            raw_metadata={"duration_seconds": 180, "resolution": "1920x1080", "fps": 60}
        )

        evd_002 = Evidence(
            id="EVD-002",
            case_id="CASE-001",
            title="PACS Access Control Log - Gate 4 Turnstile",
            evidence_type="access_log",
            source="PACS Server North-Cluster-02",
            collected_at=datetime(2026, 3, 14, 7, 0, 0, tzinfo=timezone.utc),
            chain_of_custody=[
                CustodyEntry(
                    timestamp=datetime(2026, 3, 14, 7, 10, 0, tzinfo=timezone.utc),
                    custodian="System Admin K. Thorne (ID: SA-402)",
                    action="Exported cryptographic syslog export to write-once media"
                )
            ],
            checksum="sha256:cb244e8c183141f215d2a632128711ef84f691b1d7d3d2cb29a0ec210086c8f8",
            confidence_score=0.99,
            summary="Access event registered for Badge #SYN-EMP-4421 at 02:41:09 UTC. Match confirmed for badge assigned to contractor Alex Mercer.",
            raw_metadata={"records_count": 1420, "encoding": "UTF-8"}
        )

        evd_003 = Evidence(
            id="EVD-003",
            case_id="CASE-001",
            title="Telemetry Console USB Flash Extraction Log",
            evidence_type="telemetry_dump",
            source="RTU Terminal Alpha-11",
            collected_at=datetime(2026, 3, 14, 9, 30, 0, tzinfo=timezone.utc),
            chain_of_custody=[
                CustodyEntry(
                    timestamp=datetime(2026, 3, 14, 9, 45, 0, tzinfo=timezone.utc),
                    custodian="Cyber Forensics Lead D. Vance (ID: CY-229)",
                    action="Memory dump and physical forensic image of serial controller"
                )
            ],
            checksum="sha256:9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
            confidence_score=0.95,
            summary="Log record indicates USB Mass Storage device VID:0781 PID:5583 mounted at 02:47:33 UTC. 84.2 MB of SCADA topology configurations read.",
            raw_metadata={"storage_size_bytes": 88289280, "filesystem": "FAT32"}
        )

        evd_004 = Evidence(
            id="EVD-004",
            case_id="CASE-001",
            title="Intercepted Encrypted Radio Burst 433.92 MHz",
            evidence_type="communication",
            source="Signal Monitoring Sensor Array SM-West",
            collected_at=datetime(2026, 3, 14, 3, 5, 0, tzinfo=timezone.utc),
            chain_of_custody=[
                CustodyEntry(
                    timestamp=datetime(2026, 3, 14, 3, 15, 0, tzinfo=timezone.utc),
                    custodian="SIGINT Operator T. Evans (ID: SIG-501)",
                    action="Automated SDR capture triggered on 433.92 MHz pulse"
                )
            ],
            checksum="sha256:5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8",
            confidence_score=0.88,
            summary="Shortwave directional FSK burst transmission detected 1.2km west of substation 6 minutes after entry.",
            raw_metadata={"center_freq_mhz": 433.92, "modulation": "FSK", "duration_sec": 1.4}
        )

        evd_005 = Evidence(
            id="EVD-005",
            case_id="CASE-001",
            title="Unscheduled Hexacopter Drone Flight Telemetry",
            evidence_type="flight_telemetry",
            source="Regional Airspace Monitoring Radar Station R-04",
            collected_at=datetime(2026, 3, 14, 2, 40, 0, tzinfo=timezone.utc),
            chain_of_custody=[
                CustodyEntry(
                    timestamp=datetime(2026, 3, 14, 4, 0, 0, tzinfo=timezone.utc),
                    custodian="Radar Specialist L. Gomez (ID: RS-12)",
                    action="Extracted secondary radar return track and loiter pattern"
                )
            ],
            checksum="sha256:2a9b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b",
            confidence_score=0.85,
            summary="Unidentified drone loitered 120m above perimeter fence zone B between 02:38 UTC and 02:50 UTC.",
            raw_metadata={"altitude_m": 120, "heading_deg": 42}
        )

        evd_006 = Evidence(
            id="EVD-006",
            case_id="CASE-001",
            title="Vibram Egress Footwear Impressions - Drainage Culvert",
            evidence_type="physical_impression",
            source="Forensic Crime Scene Unit East",
            collected_at=datetime(2026, 3, 14, 10, 0, 0, tzinfo=timezone.utc),
            chain_of_custody=[
                CustodyEntry(
                    timestamp=datetime(2026, 3, 14, 10, 30, 0, tzinfo=timezone.utc),
                    custodian="CSU Detective H. Wright (ID: CSU-44)",
                    action="Electrostatic dust lifter and silicone footwear casting"
                )
            ],
            checksum="sha256:d3f1a2b4c5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2",
            confidence_score=0.96,
            summary="Partial outsole impression matching Vibram Sierra tactical boot tread size 10.5 recovered 14m along perimeter drainage ditch.",
            raw_metadata={"tread_type": "Vibram Sierra", "estimated_size": "10.5 US"}
        )

        for evd in [evd_001, evd_002, evd_003, evd_004, evd_005, evd_006]:
            self._evidence[evd.id] = evd

        # ----------------------------------------------------------------------
        # ENTITIES (8 items)
        # ----------------------------------------------------------------------
        ent_001 = Entity(
            id="ENT-001",
            category="person",
            name="Alex Mercer (Synthetic Subject Alpha)",
            aliases=["Cipher_9", "Kestrel-09"],
            identifiers={"badge_id": "SYN-EMP-4421", "rfid_key": "HEX:A4:99:C1:F0"},
            attributes={
                "role": "Systems Maintenance Contractor",
                "clearance": "Level-2 Restricted",
                "organization": "AeroGrid Industrial Services",
                "status": "subject_of_interest"
            },
            reliability_score=0.85,
            notes="Contract technician with verified physical credential matching entry logs. Unaccounted for during 02:00-04:00 window.",
            case_ids=["CASE-001"]
        )

        ent_002 = Entity(
            id="ENT-002",
            category="organization",
            name="AeroGrid Industrial Services",
            aliases=["AeroGrid UK"],
            identifiers={"company_id": "SYN-CORP-9102", "duns": "98-210-4491"},
            attributes={
                "sector": "Critical Infrastructure Support",
                "jurisdiction": "Regional",
                "contract_type": "Primary SCADA Telemetry Maintenance"
            },
            reliability_score=0.95,
            notes="Prime engineering contractor managing substation RTU deployments.",
            case_ids=["CASE-001"]
        )

        ent_003 = Entity(
            id="ENT-003",
            category="vehicle",
            name="Unmarked Utility Van (Dark Gray)",
            aliases=["Target-V01"],
            identifiers={"license_plate": "SYN-WX24-VRX", "make": "TransFleet 350"},
            attributes={"color": "Dark Charcoal", "roof_mount": "Concealed antenna array"},
            reliability_score=0.75,
            notes="Vehicle observed on perimeter road camera 15 minutes prior to gate breach.",
            case_ids=["CASE-001"]
        )

        ent_004 = Entity(
            id="ENT-004",
            category="digital_asset",
            name="Exfiltrated SCADA Telemetry Archive",
            aliases=["archive_scada_vanguard.bin"],
            identifiers={"md5": "d41d8cd98f00b204e9800998ecf8427e"},
            attributes={"file_count": 84, "classification": "Confidential Grid Topology"},
            reliability_score=0.92,
            notes="Target package extracted from the substation terminal.",
            case_ids=["CASE-001"]
        )

        ent_005 = Entity(
            id="ENT-005",
            category="organization",
            name="Black Sky Logistics LLC",
            aliases=["BlackSky Group"],
            identifiers={"registration": "SYN-CORP-4821", "jurisdiction": "Offshore"},
            attributes={"profile": "Specialized logistics contractor", "risk_rating": "Elevated"},
            reliability_score=0.78,
            notes="Suspected front entity financing radio intercept and drone telemetry hardware.",
            case_ids=["CASE-001"]
        )

        ent_006 = Entity(
            id="ENT-006",
            category="location",
            name="North Telemetry Substation Gate 4",
            aliases=["Gate 4 Access Turnstile"],
            identifiers={"facility_id": "LOC-001", "geo_point": "37.772889,-122.402278"},
            attributes={"perimeter_zone": "Sector 4", "access_type": "PACS Badge + Deadbolt"},
            reliability_score=0.99,
            notes="Physical boundary breach coordinate where forced entry occurred.",
            case_ids=["CASE-001"]
        )

        ent_007 = Entity(
            id="ENT-007",
            category="digital_asset",
            name="SCADA RTU-09 Controller",
            aliases=["Terminal Unit Node 09"],
            identifiers={"ip_address": "10.14.88.9", "firmware": "v3.12-rc2"},
            attributes={"hardware": "Advantech ADAM-5000", "protocol": "Modbus TCP"},
            reliability_score=0.96,
            notes="Target PLC controller hosting regional power telemetry maps.",
            case_ids=["CASE-001"]
        )

        ent_008 = Entity(
            id="ENT-008",
            category="device",
            name="SDR Handheld Transceiver (HackRF One)",
            aliases=["Transceiver-Alpha"],
            identifiers={"serial": "SYN-HRF-9921", "freq_range": "1MHz - 6GHz"},
            attributes={"transmitter": "Custom 500mW amplifier", "payload": "FSK Trigger"},
            reliability_score=0.88,
            notes="Radio equipment correlated to the 433.92 MHz trigger burst.",
            case_ids=["CASE-001"]
        )

        for ent in [ent_001, ent_002, ent_003, ent_004, ent_005, ent_006, ent_007, ent_008]:
            self._entities[ent.id] = ent

        # ----------------------------------------------------------------------
        # INCIDENTS (2 items)
        # ----------------------------------------------------------------------
        inc_001 = Incident(
            id="INC-001",
            case_id="CASE-001",
            title="Unauthorized Substation Cabin Access",
            incident_type="physical_intrusion",
            occurred_at=datetime(2026, 3, 14, 2, 41, 0, tzinfo=timezone.utc),
            location_id="LOC-001",
            summary="Forced or cloned-credential entry into North Node telemetry cabin; CCTV and PACS alarms triggered.",
            severity="critical",
            status="verified",
            mo_id="MO-001",
            evidence_ids=["EVD-001", "EVD-002"]
        )

        inc_002 = Incident(
            id="INC-002",
            case_id="CASE-001",
            title="Direct Console Telemetry Data Extraction",
            incident_type="cyber_intrusion",
            occurred_at=datetime(2026, 3, 14, 2, 44, 0, tzinfo=timezone.utc),
            location_id="LOC-001",
            summary="Mounting of unauthorized USB storage medium and direct file read of SCADA configuration maps.",
            severity="critical",
            status="verified",
            mo_id="MO-001",
            evidence_ids=["EVD-003"]
        )

        for inc in [inc_001, inc_002]:
            self._incidents[inc.id] = inc

        # ----------------------------------------------------------------------
        # RELATIONSHIPS (10 items)
        # ----------------------------------------------------------------------
        relationships_data = [
            Relationship(
                id="REL-001",
                case_id="CASE-001",
                source_id="ENT-001",
                target_id="ENT-002",
                relationship_type="employed_by",
                direction="directed",
                weight=0.95,
                supporting_evidence_ids=["EVD-002"],
                inference_type="factual",
                confidence=0.98,
                notes="Employment contract and badge registration verify contractor status."
            ),
            Relationship(
                id="REL-002",
                case_id="CASE-001",
                source_id="ENT-001",
                target_id="INC-001",
                relationship_type="associated_with",
                direction="directed",
                weight=0.90,
                supporting_evidence_ids=["EVD-001", "EVD-002"],
                inference_type="factual",
                confidence=0.95,
                notes="Badge SYN-EMP-4421 recorded opening door during the physical intrusion incident."
            ),
            Relationship(
                id="REL-003",
                case_id="CASE-001",
                source_id="ENT-003",
                target_id="ENT-006",
                relationship_type="spotted_near",
                direction="undirected",
                weight=0.72,
                supporting_evidence_ids=["EVD-001"],
                inference_type="analytical_lead",
                confidence=0.75,
                notes="Vehicle camera sighting 1.2km away aligns with perimeter timing."
            ),
            Relationship(
                id="REL-004",
                case_id="CASE-001",
                source_id="ENT-001",
                target_id="ENT-004",
                relationship_type="accessed",
                direction="directed",
                weight=0.88,
                supporting_evidence_ids=["EVD-003"],
                inference_type="analytical_lead",
                confidence=0.85,
                notes="Console login sequence coincides with subject's active physical presence."
            ),
            Relationship(
                id="REL-005",
                case_id="CASE-001",
                source_id="ENT-001",
                target_id="ENT-005",
                relationship_type="contracted_by",
                direction="directed",
                weight=0.82,
                supporting_evidence_ids=["EVD-004"],
                inference_type="analytical_lead",
                confidence=0.80,
                notes="Offshore contract and payment trail links Mercer to Black Sky front firm."
            ),
            Relationship(
                id="REL-006",
                case_id="CASE-001",
                source_id="ENT-001",
                target_id="ENT-006",
                relationship_type="breached",
                direction="directed",
                weight=0.98,
                supporting_evidence_ids=["EVD-001", "EVD-006"],
                inference_type="factual",
                confidence=0.98,
                notes="Physical entry through Gate 4 verified by camera and footwear impressions."
            ),
            Relationship(
                id="REL-007",
                case_id="CASE-001",
                source_id="ENT-001",
                target_id="ENT-007",
                relationship_type="deployed_payload",
                direction="directed",
                weight=0.89,
                supporting_evidence_ids=["EVD-003", "EVD-004"],
                inference_type="analytical_lead",
                confidence=0.85,
                notes="USB storage payload inserted directly into RTU-09 terminal."
            ),
            Relationship(
                id="REL-008",
                case_id="CASE-001",
                source_id="ENT-008",
                target_id="ENT-005",
                relationship_type="transmitted_to",
                direction="directed",
                weight=0.78,
                supporting_evidence_ids=["EVD-004"],
                inference_type="analytical_lead",
                confidence=0.78,
                notes="Radio signal pulse matches frequency registered to Black Sky reconnaissance drone."
            ),
            Relationship(
                id="REL-009",
                case_id="CASE-001",
                source_id="ENT-007",
                target_id="ENT-006",
                relationship_type="installed_at",
                direction="directed",
                weight=0.99,
                supporting_evidence_ids=["EVD-002"],
                inference_type="factual",
                confidence=0.99,
                notes="Physical hardware installation in Sector 4 terminal building."
            ),
            Relationship(
                id="REL-010",
                case_id="CASE-001",
                source_id="ENT-001",
                target_id="ENT-008",
                relationship_type="operates",
                direction="directed",
                weight=0.85,
                supporting_evidence_ids=["EVD-004"],
                inference_type="analytical_lead",
                confidence=0.85,
                notes="Subject identified carrying handheld transceiver equipment into breach zone."
            ),
        ]

        for rel in relationships_data:
            self._relationships[rel.id] = rel

        # ----------------------------------------------------------------------
        # TIMELINE EVENTS (6 items)
        # ----------------------------------------------------------------------
        events_data = [
            TimelineEvent(
                id="EVT-001",
                case_id="CASE-001",
                timestamp=datetime(2026, 3, 12, 18, 22, 15, tzinfo=timezone.utc),
                title="Unscheduled Drone Reconnaissance Detected",
                event_type="aerial_recon",
                epistemic_type="result",
                summary="Radar station R-04 identified hexacopter loitering over Sector 4 fence.",
                confidence=0.85,
                evidence_ids=["EVD-005"],
                entity_ids=["ENT-005"]
            ),
            TimelineEvent(
                id="EVT-002",
                case_id="CASE-001",
                timestamp=datetime(2026, 3, 13, 11, 5, 40, tzinfo=timezone.utc),
                title="Encrypted Burst Transmission Recorded",
                event_type="rf_signal",
                epistemic_type="fact",
                summary="Sensor array recorded 433.92 MHz FSK burst from vicinity of access road.",
                confidence=0.92,
                evidence_ids=["EVD-004"],
                entity_ids=["ENT-008"]
            ),
            TimelineEvent(
                id="EVT-003",
                case_id="CASE-001",
                timestamp=datetime(2026, 3, 13, 23, 14, 0, tzinfo=timezone.utc),
                title="Vehicle Approaching Perimeter Access Road",
                event_type="access",
                epistemic_type="lead",
                summary="Dark utility van observed idling near perimeter drainage road without lights.",
                confidence=0.75,
                evidence_ids=["EVD-001"],
                entity_ids=["ENT-003"]
            ),
            TimelineEvent(
                id="EVT-004",
                case_id="CASE-001",
                timestamp=datetime(2026, 3, 14, 2, 41, 9, tzinfo=timezone.utc),
                title="Substation Perimeter Gate 4 Forced Entry",
                event_type="physical_intrusion",
                epistemic_type="fact",
                summary="Subject matching Mercer bypassed turnstile deadbolt using duplicate RFID card.",
                confidence=0.98,
                evidence_ids=["EVD-001", "EVD-002"],
                entity_ids=["ENT-001", "ENT-006"]
            ),
            TimelineEvent(
                id="EVT-005",
                case_id="CASE-001",
                timestamp=datetime(2026, 3, 14, 2, 47, 33, tzinfo=timezone.utc),
                title="SCADA RTU-09 Firmware Crash & Exfiltration",
                event_type="scada_alarm",
                epistemic_type="fact",
                summary="Buffer overflow triggered during unauthorized USB read; 84 MB topology data read.",
                confidence=0.96,
                evidence_ids=["EVD-003"],
                entity_ids=["ENT-007", "ENT-004"]
            ),
            TimelineEvent(
                id="EVT-006",
                case_id="CASE-001",
                timestamp=datetime(2026, 3, 14, 3, 12, 18, tzinfo=timezone.utc),
                title="Suspect Egress via Drainage Culvert",
                event_type="egress",
                epistemic_type="fact",
                summary="Footwear impressions cast in ditch 14m north confirm rapid foot egress.",
                confidence=0.95,
                evidence_ids=["EVD-006"],
                entity_ids=["ENT-001"]
            ),
        ]

        for evt in events_data:
            self._timeline[evt.id] = evt

        # ----------------------------------------------------------------------
        # HYPOTHESES (3 items)
        # ----------------------------------------------------------------------
        hyp_001 = Hypothesis(
            id="HYP-001",
            case_id="CASE-001",
            statement="Insider Sabotage via Cloned Access Credentials by rogue contractor.",
            origin="analyst",
            supporting_evidence_ids=["EVD-001", "EVD-002", "EVD-003", "EVD-006"],
            inconsistent_evidence_ids=["EVD-004"],
            credibility_score=0.82,
            created_at=datetime(2026, 3, 15, 8, 0, 0, tzinfo=timezone.utc)
        )

        hyp_002 = Hypothesis(
            id="HYP-002",
            case_id="CASE-001",
            statement="External Directed Cyber-Physical Infiltration coordinated between Mercer and Black Sky Logistics.",
            origin="analyst",
            supporting_evidence_ids=["EVD-001", "EVD-002", "EVD-003", "EVD-004", "EVD-006"],
            inconsistent_evidence_ids=[],
            credibility_score=0.89,
            created_at=datetime(2026, 3, 15, 9, 30, 0, tzinfo=timezone.utc)
        )

        hyp_003 = Hypothesis(
            id="HYP-003",
            case_id="CASE-001",
            statement="Accidental Grid Surge & Spurious Electrical Hardware Fault without intentional tampering.",
            origin="analyst",
            supporting_evidence_ids=[],
            inconsistent_evidence_ids=["EVD-001", "EVD-002", "EVD-003", "EVD-004", "EVD-006"],
            credibility_score=0.14,
            created_at=datetime(2026, 3, 15, 11, 0, 0, tzinfo=timezone.utc)
        )

        for hyp in [hyp_001, hyp_002, hyp_003]:
            self._hypotheses[hyp.id] = hyp

        # ----------------------------------------------------------------------
        # CASES (3 items)
        # ----------------------------------------------------------------------
        case_001 = Case(
            id="CASE-001",
            title="Operation Vanguard Horizon",
            summary="Multi-jurisdictional investigation into coordinated industrial espionage targeting renewable grid telemetry and SCADA infrastructure.",
            status="active",
            priority="critical",
            created_at=datetime(2026, 3, 10, 8, 0, 0, tzinfo=timezone.utc),
            updated_at=datetime(2026, 3, 22, 14, 30, 0, tzinfo=timezone.utc),
            lead_analyst="Analyst K. Vance (ID: KV-4819)",
            incident_ids=["INC-001", "INC-002"],
            entity_ids=["ENT-001", "ENT-002", "ENT-003", "ENT-004", "ENT-005", "ENT-006", "ENT-007", "ENT-008"],
            evidence_ids=["EVD-001", "EVD-002", "EVD-003", "EVD-004", "EVD-005", "EVD-006"],
            tags=["critical-infrastructure", "industrial-espionage", "scada", "cyber-physical"]
        )

        case_002 = Case(
            id="CASE-002",
            title="Operation Cobalt Sentinel",
            summary="Investigation into anomalous firmware downgrade and perimeter tampering across regional distribution nodes.",
            status="active",
            priority="high",
            created_at=datetime(2026, 3, 15, 10, 0, 0, tzinfo=timezone.utc),
            updated_at=datetime(2026, 3, 20, 11, 0, 0, tzinfo=timezone.utc),
            lead_analyst="Analyst K. Vance (ID: KV-4819)",
            incident_ids=[],
            entity_ids=["ENT-002", "ENT-007"],
            evidence_ids=["EVD-003"],
            tags=["firmware-tampering", "scada", "perimeter-security"]
        )

        case_003 = Case(
            id="CASE-003",
            title="Synthetic Maritime AIS Spoofing",
            summary="Investigation into spoofed AIS maritime tracking beacons along northern maritime transit corridors.",
            status="active",
            priority="medium",
            created_at=datetime(2026, 3, 18, 9, 0, 0, tzinfo=timezone.utc),
            updated_at=datetime(2026, 3, 21, 16, 0, 0, tzinfo=timezone.utc),
            lead_analyst="Analyst S. Chen (ID: AN-412)",
            incident_ids=[],
            entity_ids=["ENT-003", "ENT-005"],
            evidence_ids=["EVD-004"],
            tags=["maritime", "rf-spoofing", "gps-telemetry"]
        )

        self._cases[case_001.id] = case_001
        self._cases[case_002.id] = case_002
        self._cases[case_003.id] = case_003

    # --------------------------------------------------------------------------
    # REPOSITORY ACCESS METHODS
    # --------------------------------------------------------------------------
    def get_cases(self) -> List[CaseSummary]:
        summaries = []
        for c in self._cases.values():
            summaries.append(
                CaseSummary(
                    id=c.id,
                    title=c.title,
                    summary=c.summary,
                    status=c.status,
                    priority=c.priority,
                    lead_analyst=c.lead_analyst,
                    incident_count=len(c.incident_ids),
                    entity_count=len(c.entity_ids),
                    evidence_count=len(c.evidence_ids),
                    updated_at=c.updated_at
                )
            )
        return summaries

    def get_case(self, case_id: str) -> Optional[Case]:
        return self._cases.get(case_id)

    def get_all_entities(self, case_id: Optional[str] = None) -> List[Entity]:
        if case_id:
            return self.get_entities_for_case(case_id)
        return list(self._entities.values())

    def get_entities_for_case(self, case_id: str) -> List[Entity]:
        case = self._cases.get(case_id)
        if not case:
            return []
        return [self._entities[eid] for eid in case.entity_ids if eid in self._entities]

    def get_all_evidence(self, case_id: Optional[str] = None) -> List[Evidence]:
        if case_id:
            return self.get_evidence_for_case(case_id)
        return list(self._evidence.values())

    def get_evidence_for_case(self, case_id: str) -> List[Evidence]:
        case = self._cases.get(case_id)
        if not case:
            return []
        return [self._evidence[evid] for evid in case.evidence_ids if evid in self._evidence]

    def get_all_relationships(self, case_id: Optional[str] = None) -> List[Relationship]:
        if case_id:
            return self.get_relationships_for_case(case_id)
        return list(self._relationships.values())

    def get_relationships_for_case(self, case_id: str) -> List[Relationship]:
        return [r for r in self._relationships.values() if r.case_id == case_id]

    def get_timeline(self, case_id: Optional[str] = None) -> List[TimelineEvent]:
        events = list(self._timeline.values())
        if case_id:
            events = [e for e in events if e.case_id == case_id]
        events.sort(key=lambda x: x.timestamp)
        return events

    def get_hypotheses(self, case_id: Optional[str] = None) -> List[Hypothesis]:
        hypotheses = list(self._hypotheses.values())
        if case_id:
            hypotheses = [h for h in hypotheses if h.case_id == case_id]
        hypotheses.sort(key=lambda x: x.credibility_score, reverse=True)
        return hypotheses

    def get_dashboard_summary(self) -> DashboardSummary:
        facts_count = sum(1 for e in self._evidence.values() if e.confidence_score >= 0.95)
        results_count = sum(1 for e in self._evidence.values() if 0.80 <= e.confidence_score < 0.95)
        leads_count = sum(1 for r in self._relationships.values() if r.inference_type == "analytical_lead")

        return DashboardSummary(
            total_cases=len(self._cases),
            total_entities=len(self._entities),
            total_evidence=len(self._evidence),
            total_relationships=len(self._relationships),
            total_timeline_events=len(self._timeline),
            total_hypotheses=len(self._hypotheses),
            epistemic_breakdown=EpistemicBreakdown(
                facts_count=facts_count,
                results_count=results_count,
                leads_count=leads_count
            ),
            system_status={
                "backend": "online",
                "fastapi": "0.110.0",
                "database": "canonical_in_memory_sqlite_ready",
                "ai_provider": "ollama_local",
                "model": "gemma:4e4b-q4",
                "environment": "demonstration"
            },
            recent_cases=self.get_cases(),
            is_synthetic_demonstration=True
        )

    def get_summary_counts(self) -> Dict[str, int]:
        return {
            "cases_count": len(self._cases),
            "entities_count": len(self._entities),
            "incidents_count": len(self._incidents),
            "evidence_count": len(self._evidence),
            "relationships_count": len(self._relationships),
            "timeline_count": len(self._timeline),
            "hypotheses_count": len(self._hypotheses)
        }

    def validate_referential_integrity(self) -> List[str]:
        """Runs referential integrity audit across all records."""
        violations = []
        for case in self._cases.values():
            for iid in case.incident_ids:
                if iid not in self._incidents:
                    violations.append(f"Case {case.id} references missing Incident {iid}")
            for eid in case.entity_ids:
                if eid not in self._entities:
                    violations.append(f"Case {case.id} references missing Entity {eid}")
            for evid in case.evidence_ids:
                if evid not in self._evidence:
                    violations.append(f"Case {case.id} references missing Evidence {evid}")

        for rel in self._relationships.values():
            if rel.source_id not in self._entities and rel.source_id not in self._incidents:
                violations.append(f"Relationship {rel.id} has invalid source_id {rel.source_id}")
            if rel.target_id not in self._entities and rel.target_id not in self._incidents:
                violations.append(f"Relationship {rel.id} has invalid target_id {rel.target_id}")
            for evid in rel.supporting_evidence_ids:
                if evid not in self._evidence:
                    violations.append(f"Relationship {rel.id} cites missing Evidence {evid}")

        for evt in self._timeline.values():
            if evt.case_id not in self._cases:
                violations.append(f"Timeline event {evt.id} references invalid case {evt.case_id}")
            for evid in evt.evidence_ids:
                if evid not in self._evidence:
                    violations.append(f"Timeline event {evt.id} references missing evidence {evid}")
            for eid in evt.entity_ids:
                if eid not in self._entities:
                    violations.append(f"Timeline event {evt.id} references missing entity {eid}")

        for hyp in self._hypotheses.values():
            if hyp.case_id not in self._cases:
                violations.append(f"Hypothesis {hyp.id} references invalid case {hyp.case_id}")
            for evid in hyp.supporting_evidence_ids:
                if evid not in self._evidence:
                    violations.append(f"Hypothesis {hyp.id} references missing supporting evidence {evid}")
            for evid in hyp.inconsistent_evidence_ids:
                if evid not in self._evidence:
                    violations.append(f"Hypothesis {hyp.id} references missing inconsistent evidence {evid}")

        return violations


# Singleton instance
canonical_store = CanonicalSyntheticStore()
