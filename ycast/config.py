import logging

simple_enabled = False


def __init__(self):
    pass


def set_simple_enabled(simple):
    global simple_enabled
    if simple:
        simple_enabled = True
        logging.debug("config simple_enabled = True " + str(simple_enabled) + ' ' + str(simple))
    else:
        simple_enabled = False
        logging.debug("config simple_enabled = False " + str(simple_enabled) + ' ' + str(simple))
