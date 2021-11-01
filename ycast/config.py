import logging

simple_enabled = False

def init():
    global simple_enabled

def set_simple_enabled(simple):
    if simple:
        simple_enabled = simple
        logging.debug("config simple_enabled = True " + str(simple_enabled) + ' ' + str(simple))
    else:
        simple_enabled = simple
        logging.debug("config simple_enabled = False " + str(simple_enabled) + ' ' + str(simple))
