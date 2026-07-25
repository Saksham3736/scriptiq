import os
import sys
import unittest
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from agents.speech_agent import SpeechAgent


class TestSpeechAgent(unittest.TestCase):
    def setUp(self):
        self.agent = SpeechAgent(model_size="tiny")

    def test_refine_transcript(self):
        raw_text = "Patient Rahul Sharma complaining of fever Dolo six fifty twice daily"
        refined = self.agent.refine_transcript(raw_text)
        self.assertIsInstance(refined, str)
        self.assertGreater(len(refined), 0)


if __name__ == "__main__":
    unittest.main()
