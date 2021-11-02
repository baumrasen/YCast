import logging

simple_enabled = False


def __init__(self):
    pass


def set_simple_enabled(simple):
    global simple_enabled
    if simple:
        simple_enabled = True
    else:
        simple_enabled = False
