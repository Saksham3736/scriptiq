"""
Phase 63 — Manual Test Script: Tool-Use vs Single-Shot Extraction
Run: .venv\Scripts\python.exe tests\test_phase63_manual.py
"""
import os, sys, json, time
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))

from agents.prescription_agent import PrescriptionAgent

# ── Sample Hindi/English Clinical Transcript ──
TRANSCRIPT = """
Patient ka naam Priya Mehta hai, age 32 years, female.
Date of birth 15 August 1993. Phone number 9876543210.
Email priya.mehta@gmail.com.

Paanch din se bukhar aa raha hai, gala kharab hai, khansi bhi hai aur badan mein dard ho raha hai.
Temperature 101.2 degree hai.

Diagnosis: Acute Upper Respiratory Tract Infection with Pharyngitis.

Dawai likhte hain:
1. Dolo 650 — subah shaam, khana khane ke baad, 5 din ke liye.
2. Azithromycin 500mg — din mein ek baar, khana khane ke baad, 3 din.
3. Montek LC — raat ko sone se pehle, 5 din.
4. Benadryl syrup — 10ml TDS, 5 din.
5. Pan 40 — subah khali pet, 5 din.

Tests: CBC aur CRP karwa lein.

Advice: Garam paani piyen, rest karein, cold drinks avoid karein, aur vitamin C wale fruits khayein.

Follow up 5 din baad.
"""

def run_test():
    agent = PrescriptionAgent()

    print("\n" + "="*80)
    print("🔧 TEST 1: TOOL-USE EXTRACTION (Phase 63)")
    print("="*80)
    t1 = time.time()
    tool_result = agent.generate_prescription_with_tools(TRANSCRIPT)
    t1_elapsed = time.time() - t1

    if tool_result:
        print(f"\n✅ Tool-Use Result ({t1_elapsed:.2f}s):")
        print(json.dumps(tool_result, indent=2, ensure_ascii=False))
    else:
        print(f"\n❌ Tool-Use returned None ({t1_elapsed:.2f}s) — would fall back to single-shot")

    print("\n" + "="*80)
    print("📋 TEST 2: FULL PIPELINE (tool-use → single-shot → heuristic)")
    print("="*80)
    t2 = time.time()
    full_result = agent.process_consultation(TRANSCRIPT)
    t2_elapsed = time.time() - t2

    print(f"\n✅ Full Pipeline Result ({t2_elapsed:.2f}s):")
    print(f"   Valid: {full_result['valid']}")
    rx = full_result["prescription"]
    print(f"   Patient: {rx.get('patient_name', '—')}")
    print(f"   Age: {rx.get('age', '—')} | Gender: {rx.get('gender', '—')}")
    print(f"   DOB: {rx.get('patient_dob', '—')} | Phone: {rx.get('phone', '—')}")
    print(f"   Email: {rx.get('patient_email', '—')}")
    print(f"   Chief Complaint: {rx.get('chief_complaint', '—')}")
    print(f"   Diagnosis: {rx.get('diagnosis', '—')}")
    print(f"   Medicines ({len(rx.get('medicines', []))}):")
    for i, med in enumerate(rx.get("medicines", []), 1):
        print(f"     {i}. {med.get('name', '?')} — {med.get('dosage', '?')} — {med.get('duration', '?')} — {med.get('meal_instruction', '?')}")
    print(f"   Tests: {rx.get('tests', [])}")
    print(f"   Advice: {rx.get('general_advice', [])}")
    print(f"   Follow-up: {rx.get('follow_up', '—')}")

if __name__ == "__main__":
    run_test()
