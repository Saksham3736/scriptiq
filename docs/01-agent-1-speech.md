# Agent 1 — Speech Agent

## Overview

The Speech Agent is the first agent in the AI Prescription Assistant workflow.

Its responsibility is to listen to the doctor's conversation, convert it into text, and provide a clean transcript for the next agent.

This agent **does not perform any medical analysis**. It only captures and prepares the conversation.

---

# Objective

Convert the doctor's speech into an accurate transcript that can be understood by the Prescription Agent.

---

# Workflow

```
Doctor Starts Consultation
          │
          ▼
Record Voice
          │
          ▼
Convert Speech to Text
          │
          ▼
Display Live Transcript
          │
          ▼
Doctor Reviews Transcript (Optional)
          │
          ▼
Send Transcript to Agent 2
```

---

# Responsibilities

The Speech Agent should:

- Record the doctor's voice.
- Convert speech into text.
- Maintain punctuation.
- Display the transcript on the screen.
- Allow the doctor to edit the transcript if required.
- Pass the final transcript to the Prescription Agent.

---

# Input

Doctor's voice.

Example:

```
Patient name Rahul Sharma.

Age twenty-four.

Complaining of fever and sore throat since two days.

Temperature one hundred one.

Prescribe Dolo 650 twice daily for five days.

Azithromycin 500 once daily after food for three days.

Drink plenty of water.

Follow up after five days.
```

---

# Output

A plain text transcript.

Example

```
Patient Name: Rahul Sharma

Age: 24

Complaining of fever and sore throat since 2 days.

Temperature 101°F.

Prescribe Dolo 650 twice daily for 5 days.

Azithromycin 500 once daily after food for 3 days.

Drink plenty of water.

Follow up after 5 days.
```

---

# Data Passed to Agent 2

```json
{
    "transcript": "Patient Name Rahul Sharma. Age 24. Complaining of fever..."
}
```

---

# Libraries Required

## Speech Recognition

```
faster-whisper
```

Recommended because:

- Good medical transcription accuracy
- Fast
- Offline support
- Better punctuation than many online services

---

## Audio Recording

```
sounddevice
```

Used for recording the doctor's voice.

---

## Audio Processing

```
numpy
```

Used for handling audio data before transcription.

---

## Temporary File Handling

```
wave
```

Used to save recorded audio as a WAV file before transcription.

---

# Suggested File Structure

```
agents/

speech_agent.py
```

---

# Main Functions

## Record Audio

```python
record_audio()
```

Purpose

- Start microphone
- Stop recording
- Save audio

Returns

```
audio.wav
```

---

## Convert Speech to Text

```python
speech_to_text(audio_path)
```

Purpose

- Read audio file
- Convert speech into text

Returns

```
Transcript
```

---

## Display Transcript

```python
show_transcript(text)
```

Purpose

Display transcript inside Streamlit.

---

## Send Transcript

```python
send_to_prescription_agent(transcript)
```

Purpose

Pass transcript to Agent 2.

---

# Streamlit UI

```
--------------------------------------

Patient Name

Age

Gender

--------------------------------------

🎤 Start Recording

🛑 Stop Recording

--------------------------------------

Transcript

_______________________________

Patient has fever...

_______________________________

[ Edit Transcript ]

[ Generate Prescription ]

--------------------------------------
```

---

# Example Consultation

Doctor says

```
Patient has cough since four days.

No history of diabetes.

Prescribe Mucinac tablet twice daily after meals for five days.

Drink warm water.
```

Transcript generated

```
Patient has cough since 4 days.

No history of diabetes.

Prescribe Mucinac tablet twice daily after meals for 5 days.

Drink warm water.
```

---

# Validation

Before sending the transcript to Agent 2, check that:

- Transcript is not empty.
- Audio was successfully processed.
- Minimum speech length is available.
- No transcription errors occurred.

If validation fails, ask the doctor to record again.

---

# Error Handling

Possible errors:

### Microphone not detected

Show message:

```
Microphone not found.
Please connect a microphone and try again.
```

---

### No speech detected

Show message:

```
No speech detected.

Please record again.
```

---

### Whisper Model Error

Show message:

```
Unable to transcribe audio.

Please try again.
```

---

### Empty Transcript

Show message:

```
Transcript is empty.

Please record again.
```

---

# Expected Output

The final output from this agent should always be a simple JSON object.

```json
{
    "transcript": "Patient has fever since two days. Prescribe Dolo 650 twice daily for five days."
}
```

This JSON will be directly passed to **Agent 2 (Prescription Agent)**.

---

# Future Improvements

The MVP keeps this agent simple.

Possible future enhancements:

- Real-time live transcription
- Speaker identification (Doctor vs Patient)
- Noise cancellation
- Multi-language transcription
- Medical vocabulary optimization
- Voice activity detection
- Automatic punctuation improvement
- Save audio recordings for future reference (optional)

---

# Summary

### Input

Doctor's voice

↓

### Processing

Record audio

↓

Convert speech to text

↓

Display transcript

↓

Doctor review (optional)

↓

### Output

Transcript JSON sent to Agent 2