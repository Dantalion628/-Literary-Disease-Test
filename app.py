import hashlib
import json
import uuid

from flask import Flask, jsonify, redirect, render_template, request, url_for

import config
import database as db
from quiz_data import QUESTIONS, RESULTS
from scoring import calculate_result, get_result_data

app = Flask(__name__)
app.secret_key = config.SECRET_KEY


@app.before_request
def ensure_db():
    db.init_db()


# ── Landing page ──────────────────────────────
@app.route("/")
def index():
    return render_template("index.html")


# ── Quiz page ─────────────────────────────────
@app.route("/quiz")
def quiz():
    questions_json = json.dumps(QUESTIONS, ensure_ascii=False)
    return render_template("quiz.html", questions_json=questions_json)


# ── Submit answers ────────────────────────────
@app.route("/submit", methods=["POST"])
def submit():
    data = request.get_json(silent=True)
    if not data or "answers" not in data:
        return jsonify({"error": "missing answers"}), 400

    answers = data["answers"]
    if (
        not isinstance(answers, list)
        or len(answers) != 25
        or not all(isinstance(a, int) and 0 <= a <= 3 for a in answers)
    ):
        return jsonify({"error": "invalid answers"}), 400

    result_key = calculate_result(answers)
    session_id = str(uuid.uuid4())
    ip_raw = request.remote_addr or ""
    ip_hash = hashlib.sha256(ip_raw.encode()).hexdigest()

    db.increment_result(
        result_key=result_key,
        session_id=session_id,
        answers_json=json.dumps(answers),
        ip_hash=ip_hash,
    )

    return jsonify({
        "result_key": result_key,
        "redirect": url_for("result", key=result_key),
    })


# ── Result page ───────────────────────────────
@app.route("/result/<key>")
def result(key):
    if key not in RESULTS:
        return redirect(url_for("index"))
    data = get_result_data(key)
    stats = db.get_stats()
    total = sum(r["count"] for r in stats) or 1
    return render_template(
        "result.html",
        key=key,
        data=data,
        stats=stats,
        total=total,
    )


# ── Stats page (optional admin view) ─────────
@app.route("/stats")
def stats():
    rows = db.get_stats()
    total = sum(r["count"] for r in rows) or 1
    return render_template("stats.html", rows=rows, total=total)


if __name__ == "__main__":
    db.init_db()
    app.run(debug=config.DEBUG, port=5000)
