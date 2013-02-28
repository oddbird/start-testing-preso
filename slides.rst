:title: Getting started testing
:author: Carl Meyer
:description: a presentation for PyCon US 2013
:keywords: presentation, python, testing, pycon
:css: css/highlight.css
:css: css/oddbird.css

:skip-help: true


----


:id: title

Getting started testing
=======================

|hcard|

.. |hcard| raw:: html

  <div class="vcard">
  <img src="images/template/logo.svg" alt="OddBird" class="logo" />
  <h2 class="fn">Carl Meyer</h2>
  <ul class="links">
    <li><a href="http://www.oddbird.net" class="org url">oddbird.net</a></li>
    <li><a href="https://twitter.com/carljm" rel="me">@carljm</a></li>
  </ul>
  </div>

----

A simple function
-----------------

.. code:: python

    def similarity(watched1, watched2):
        """
        Return similarity score between users watching given sets of repos.

        The similarity score is the Jaccard index (size of intersection / size of
        union); it varies between 0 (no similarity) and 1 (identical sets).

        """
        intersection = watched1.intersection(watched2)
        union = watched1.union(watched2)

        return float(len(intersection)) / len(union)


----


.. code:: python

    $ python
    Python 3.3.0 (default, Feb 11 2013, 20:11:18)
    [GCC 4.6.3] on linux
    Type "help", "copyright", "credits" or "license" for more information.
    >>> from ghre.similarity import similarity_score

    >>> similarity_score({'a', 'b'}, {'b', 'c'})
    0.3333333333333333

    >>> similarity_score({'a', 'b', 'c'}, {'b', 'c', 'd'})
    0.5

    >>> similarity_score({'a', 'b', 'c'}, {'d'})
    0.0

    >>> similarity_score(set(), set())
    Traceback (most recent call last):
      File "<stdin>", line 1, in <module>
      File "./ghre/similarity.py", line 12, in similarity_score
        return float(len(intersection)) / len(union)
    ZeroDivisionError: float division by zero


----

This is a bulleted list:

* One item here.

* Another here.

* And a third that is long enough to perhaps wrap to another line.

----

This slide has only a subtitle
------------------------------

----

This slide has a subtitle
-------------------------

And some additional text underneath it.


----

:data-fullwidth: 1

.. image:: images/exam.jpg
   :width: 1024px
   :height: 768px
