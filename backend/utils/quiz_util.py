
import random
import string


def generate_quiz_id(length=16):
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=length))


# print(generate_quiz_id())
