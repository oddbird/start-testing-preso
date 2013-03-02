import manuel.capture
import manuel.codeblock
import manuel.doctest
import manuel.ignore
import manuel.testing
import unittest

def tests():
    m = manuel.ignore.Manuel()
    m += manuel.doctest.Manuel()
    m += manuel.codeblock.Manuel()
    m += manuel.capture.Manuel()
    return manuel.testing.TestSuite(m, r'slides.rst')


if __name__ == '__main__':
    unittest.TextTestRunner().run(tests())
