import sqlite3
import config

RESULT_KEYS = [
    ("zhang_ailing", "苍凉如斯"),
    ("jian_zhen",    "幽深"),
    ("qiu_miaojin",  "迷途之中"),
    ("sanmao",       "流浪"),
    ("haizi",        "麦地之诗"),
    ("mishima",      "金阁之焰"),
    ("borges",       "迷宫"),
    ("duras",        "欲"),
    ("kafka",        "困兽"),
    ("sartre",       "他人即地狱"),
    ("baudelaire",   "恶之花"),
    ("beauvoir",     "清醒如刀"),
    ("wenming",      "文盲"),
]


def get_conn():
    conn = sqlite3.connect(config.DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    with get_conn() as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS result_stats (
                result_key  TEXT PRIMARY KEY,
                result_name TEXT NOT NULL,
                count       INTEGER DEFAULT 0,
                last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        """)
        conn.execute("""
            CREATE TABLE IF NOT EXISTS quiz_sessions (
                id           INTEGER PRIMARY KEY AUTOINCREMENT,
                session_id   TEXT NOT NULL,
                result_key   TEXT NOT NULL,
                answers_json TEXT,
                ip_hash      TEXT,
                created_at   DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        """)
        for key, name in RESULT_KEYS:
            conn.execute(
                "INSERT OR IGNORE INTO result_stats (result_key, result_name) VALUES (?, ?)",
                (key, name)
            )
        conn.commit()


def increment_result(result_key, session_id, answers_json, ip_hash):
    with get_conn() as conn:
        conn.execute(
            "UPDATE result_stats SET count = count + 1, last_updated = CURRENT_TIMESTAMP WHERE result_key = ?",
            (result_key,)
        )
        conn.execute(
            "INSERT INTO quiz_sessions (session_id, result_key, answers_json, ip_hash) VALUES (?, ?, ?, ?)",
            (session_id, result_key, answers_json, ip_hash)
        )
        conn.commit()


def get_stats():
    with get_conn() as conn:
        rows = conn.execute(
            "SELECT result_key, result_name, count FROM result_stats ORDER BY count DESC"
        ).fetchall()
    return [dict(r) for r in rows]
