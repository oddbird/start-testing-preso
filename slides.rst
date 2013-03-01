:title: Getting started testing
:author: Carl Meyer
:description: a presentation on getting started testing, for PyCon US 2013
:keywords: presentation, python, testing, pycon

:skip-help: true


----

:id: title

Getting started testing
=======================

|hcard|

----

:id: thistalk
:data-reveal: 1

A little talk about testing
---------------------------

* Why?

* How?

* When?

* How much?

* What if...?

|lightbulb|

.. |lightbulb| raw:: html

   <img src="images/lightbulb.svg" alt="light bulb" class="innerStep" height="300px" />

.. note::

   Here's the plan for the next half hour: we'll talk about why to write tests,
   how to write them, when to write them, how many to write, and a few "what
   if?" scenarios and how to handle them.

   Hopefully by the end the testing lightbulb will go off (if it hasn't
   already), and you'll be so hooked you won't even be able to sleep tonight
   until you've written a bunch of tests.


----

:data-reveal: 1

Me
----

* Writing Python since 2002.

* Professionally since 2007.

* Writing a lot of tests since 2009.

* Mostly web development.

|logo|

.. |logo| raw:: html

  <a href="http://www.oddbird.net" class="innerStep">
    <img src="images/logo.svg" alt="OddBird" class="logo" />
  </a>

.. note::

   A very brief story about me, Python, and testing...

   I like to write tests.

   I mostly do web development, but I've tried to keep this talk general.

   You can hire us!

----

Let's make a thing!

.. note::

   A GitHub recommendation engine!

   Find the projects you ought to know about, but don't yet!

   (It's been done. Oh well.)

.. code:: python

    def similarity(watched1, watched2):
        """
        Similarity score between users watching given lists of repos.

        The similarity score is the Jaccard index (size of intersection / size of
        union); it varies between 0 (no similarity) and 1 (identical sets).

        """
        intersection = watched1.intersection(watched2)
        union = watched1.union(watched2)

        return float(len(intersection)) / len(union)


----

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

    >>> similarity({'a', 'b'}, {'b', 'c'})
    0.3333333333333333

    >>> similarity({'a', 'b', 'c'}, {'b', 'c', 'd'})
    0.5

    >>> similarity({'a', 'b', 'c'}, {'d'})
    0.0

    >>> similarity(set(), set())
    Traceback (most recent call last):
      File "<stdin>", line 1, in <module>
      File "./ghre/similarity.py", line 12, in similarity_score
        return float(len(intersection)) / len(union)
    ZeroDivisionError: float division by zero


----

:id: questions

Questions?
==========

* `oddbird.github.com/start-testing`_
* `pytest.org`_
* `nedbatchelder.com/code/coverage/`_
* `www.voidspace.org.uk/python/mock/`_
* `tox.readthedocs.org`_
* `webtest.pythonpaste.org`_

.. _oddbird.github.com/start-testing: http://oddbird.github.com/start-testing
.. _pytest.org: http://pytest.org/
.. _nedbatchelder.com/code/coverage/: http://nedbatchelder.com/code/coverage/
.. _www.voidspace.org.uk/python/mock/: http://www.voidspace.org.uk/python/mock/
.. _tox.readthedocs.org: http://tox.readthedocs.org
.. _webtest.pythonpaste.org: http://webtest.pythonpaste.org

|hcard|

.. |hcard| raw:: html

  <div class="vcard">
  <a href="http://www.oddbird.net">
    <img src="images/logo.svg" alt="OddBird" class="logo" />
  </a>
  <h2 class="fn">Carl Meyer</h2>
  <ul class="links">
    <li><a href="http://www.oddbird.net" class="org url">oddbird.net</a></li>
    <li><a href="https://twitter.com/carljm" rel="me">@carljm</a></li>
  </ul>
  </div>
