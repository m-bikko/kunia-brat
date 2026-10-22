import json
import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from extract_order70 import RAW, build, split_category  # noqa: E402

EXPECTED = {"informatics": 22, "art": 54, "sewing": 65, "pottery": 45,
            "workshop": 114, "kazakh": 39, "russian": 30, "english": 29}


class SplitCategoryTest(unittest.TestCase):
    def test_multi_word_category(self):
        self.assertEqual(split_category("МЕБЕЛЬ ДЛЯ КАБИНЕТА Доска маркерная"),
                         ("МЕБЕЛЬ ДЛЯ КАБИНЕТА", "Доска маркерная"))

    def test_category_with_comma(self):
        self.assertEqual(split_category("ПОСОБИЯ, СТЕНДЫ И ПРОГРАММЫ Таблица «IT-технологии»"),
                         ("ПОСОБИЯ, СТЕНДЫ И ПРОГРАММЫ", "Таблица «IT-технологии»"))

    def test_kazakh_item_name(self):
        self.assertEqual(split_category("УЧЕБНЫЕ ПОСОБИЯ Қазақ тілінің түсіндірме сөздігі")[1],
                         "Қазақ тілінің түсіндірме сөздігі")

    def test_collapses_whitespace(self):
        self.assertEqual(split_category("МЕБЕЛЬ  Стол\nкомпьютерный"), ("МЕБЕЛЬ", "Стол компьютерный"))

    def test_rejects_row_without_category(self):
        with self.assertRaises(ValueError):
            split_category("Доска маркерная")


class BuildTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.data = build(json.loads(RAW.read_text(encoding="utf-8")))

    def test_counts_match_live_site(self):
        counts = {c: sum(len(g["items"]) for g in groups) for c, groups in self.data.items()}
        self.assertEqual(counts, EXPECTED)

    def test_categories_are_unique_per_cabinet(self):
        for cabinet, groups in self.data.items():
            names = [g["category"] for g in groups]
            self.assertEqual(len(names), len(set(names)), cabinet)

    def test_units_are_lowercase(self):
        for groups in self.data.values():
            for group in groups:
                for item in group["items"]:
                    self.assertEqual(item["unit"], item["unit"].lower())


if __name__ == "__main__":
    unittest.main()
