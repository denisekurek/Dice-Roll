from pathlib import Path
import random

from flask import Flask, jsonify, request, send_file

app = Flask(__name__)

@app.get("/")
def home():
    return send_file(Path(__file__).with_name("index.html"))


@app.get("/results")
def results_page():
    return send_file(Path(__file__).with_name("results.html"))


@app.post("/api/assign")
def assign():
    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return jsonify(error="Expected a JSON object with participants and numGifts."), 400

    raw_participants = data.get("participants")
    if not isinstance(raw_participants, list) or not all(
        isinstance(name, str) for name in raw_participants
    ):
        return jsonify(error="Participants must be a list of names."), 400

    participants = [name.strip() for name in raw_participants if name.strip()]
    if len(participants) < 2:
        return jsonify(error="Enter at least two participants."), 400

    normalized_names = [name.casefold() for name in participants]
    if len(set(normalized_names)) != len(participants):
        return jsonify(error="Participant names must be unique."), 400

    num_gifts = data.get("numGifts")
    if isinstance(num_gifts, bool) or not isinstance(num_gifts, int):
        return jsonify(error="Number of gifts must be a whole number."), 400

    if num_gifts < 1 or num_gifts >= len(participants):
        return jsonify(
            error=f"Each person can give between 1 and {len(participants) - 1} gifts."
        ), 400

    shuffled_participants = participants.copy()
    random.shuffle(shuffled_participants)
    participant_count = len(shuffled_participants)
    assignments = [
        {
            "gifter": shuffled_participants[index],
            "giftees": [
                shuffled_participants[(index + offset) % participant_count]
                for offset in range(1, num_gifts + 1)
            ],
        }
        for index in range(participant_count)
    ]
    return jsonify(assignments=assignments)

if __name__ == "__main__":
    app.run(debug=True)