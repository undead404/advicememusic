import random


class RouletteWheel(object):
    # tuples of lower and upper border of each choice
    __border_pairs = None
    # choices itselves
    __choices = None
    # lower border in total
    __lower_border = None
    # upper border in total
    __upper_border = None

    def __init__(self):
        self.__lower_border = 0.0
        self.__upper_border = 0.0
        self.__choices = {}
        self.__border_pairs = []

    def add_variant(self, variant, probability):
        border_pair = self.__upper_border, self.__upper_border + probability
        self.__border_pairs.append(border_pair)
        self.__choices[border_pair] = variant
        self.__upper_border += probability

    def get_choice(self):
        # if no variant is present
        if not self.__border_pairs:
            raise RouletteIsEmptyException
        # pick random float
        choice_point = random.uniform(self.__lower_border, self.__upper_border)
        # find corresponding border pair
        choice_border_pair = next(border_pair for border_pair in self.__border_pairs if
                                  border_pair[0] <= choice_point <= border_pair[1])
        # return corresponding choice
        return self.__choices[choice_border_pair]


class RouletteIsEmptyException(Exception):
    pass

