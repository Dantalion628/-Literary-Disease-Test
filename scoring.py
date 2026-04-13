from collections import defaultdict
from quiz_data import QUESTIONS, RESULTS

# Result keys: zhang_ailing / jian_zhen / qiu_miaojin / sanmao /
#              haizi / mishima / borges / duras / kafka /
#              sartre / baudelaire / beauvoir / wenming


def calculate_result(answers: list) -> str:
    """
    answers: list of 25 integers (0-3), each is the chosen option index.
    Returns a result key string.
    """
    scores = defaultdict(int)
    wenming_count = 0

    for i, answer_idx in enumerate(answers):
        option = QUESTIONS[i]["options"][answer_idx]
        for key, pts in option["weights"].items():
            scores[key] += pts
            if key == "wenming":
                wenming_count += 1

    # Easter egg: 10+ philistine answers → 文盲
    if wenming_count >= 10:
        return "wenming"

    scores.pop("wenming", None)

    if not scores:
        return "zhang_ailing"

    return max(scores, key=scores.get)


def get_result_data(result_key: str) -> dict:
    return RESULTS.get(result_key, RESULTS["zhang_ailing"])
