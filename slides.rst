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

This talk
---------

* Why test?

* How to test?

* When to test?

* How much to test?

* What if...?

|lightbulb|

.. |lightbulb| raw:: html

   <img src="images/lightbulb.svg" alt="light bulb" class="innerStep" height="300px" />

.. note::

   So here's the plan for the next half hour:

   * We'll discuss (briefly!) why to write tests.

   * We'll talk about how to write tests in Python, with lots of code examples
     and tool recommendations.

   * We'll talk about when to write your tests,

   * ...which tests and how many tests to write.

   * And we'll talk about some common what-if scenarios, like adding tests to a
     large untested codebase.

   Hopefully by the end the testing lightbulb will turn on (if it hasn't
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

.. note::

   A very brief story about me, Python, and testing...

   I like to write tests. Even this slide deck has tests!

   I mostly do web development, but I've tried to keep this talk general.

----

.. image:: images/logo.svg
   :width: 800px

.. note::

   I work at OddBird, we build beautiful web apps, you can hire us!

----

Let's make a thing!
-------------------

.. note::

   A GitHub recommendation engine!

   Find the projects you ought to know about, but don't yet, based on the
   projects other people are watching who tend to watch the same projects you
   do.

   (It's been done already. Oh well.)

----

``gitrecs.py``
--------------

.. code:: python

    def similarity(watched1, watched2):
        """
        Return similarity score for two users.

        Users represented as list of watched repos.

        Score is Jaccard index (intersection / union).

        """
        intersection = 0
        for repo in watched1:
            if repo in watched2:
                intersection += 1
        union = len(watched1) + len(watched2) - intersection

        return float(intersection) / union

.. note::

   Here's a function to give a similarity score between two users, as a
   floating point number between 0 and 1. We calculate the size of the
   intersection between the two lists and the size of the union of the two
   lists, and return the Jaccard index, which is intersection over union.

   Now of course we want to make sure it works, so let's try it out in the
   shell!

----

It works!
---------

.. code:: python

    >>> similarity(['a', 'b'], ['b', 'c', 'd'])
    0.25

    >>> similarity(['a', 'b', 'c'], ['b', 'c', 'd'])
    0.5

    >>> similarity(['a', 'b', 'c'], ['d'])
    0.0

.. note::

   So far, so good!

   But I'm guessing a bunch of you are on the tip of your seats wanting to tell
   me about the bugs you already spotted in this implementation. Here's one...

----

Uh oh
-----

.. code:: python

    >>> similarity(['a', 'a', 'b'], ['b'])
    0.3333333333333333

.. note::

   Jaccard index is really a set metric, and our naive implementation with
   lists doesn't handle duplicates correctly. The union of these should be 2,
   making the similarity score 1/2, but instead we calculate a union of 3 and
   so get a similarity score of 1/3.

   Fortunately, Python's got an excellent built-in set data structure, so let's
   rewrite to use that instead and fix this bug!

----

Now with more ``set``
---------------------

.. code:: python

    def similarity(watched1, watched2):
        """
        Return similarity score for two users.

        Users represented as list of watched repos.

        Score is Jaccard index (intersection / union).

        """
        watched1, watched2 = set(watched1), set(watched2)
        intersection = watched1.intersection(watched2)
        union = watched1.union(watched2)

        return len(intersection) / len(union)

----

Fixed!
------

.. code:: python

    >>> similarity(['a', 'a', 'b'], ['b'])
    0.5

.. note::

   So we fire up the shell again and re-type that last test that failed. Great,
   it works for this case! But we want to make sure it works for the other
   cases the first version worked for, so let's try them too...

----

Did we break anything?
----------------------

.. code:: python

    >>> similarity({'a', 'b'}, {'b', 'c', 'd'})
    0.25

    >>> similarity({'a', 'b', 'c'}, {'b', 'c', 'd'})
    0.5

    >>> similarity({'a', 'b', 'c'}, {'d'})
    0.0

.. note::

   All good!

----

This will get old.
------------------

.. note::

   At this point we've spent an awful lot of time typing stuff into the Python
   shell. And we don't have much to show for it - we know that this version
   works for the cases we've tried, but if we have to change it in future we're
   back at square one, typing things into the shell. That'll get old fast.

   Or if you're developing a web app, loading it up in the browser and clicking
   around. One guy I talked with said he used to develop a 14-page survey app
   without tests, and every time anything on the 14th page changed, he had to
   click through and fill out every page of the survey to find out if his
   change worked. It pains me just to think about that.

----

We're software developers!
--------------------------

.. note::

   We know how to handle boring repetitive tasks, we write software to automate
   them!

----

.. invisible-code-block:: python

    import io, sys, types
    sys.modules['gitrecs'] = types.ModuleType('gitrecs')
    sys.modules['gitrecs'].similarity = similarity
    sys._old_stdout = sys.stdout
    sys.stdout = io.StringIO()


``test_gitrecs.py``
-------------------

.. code:: python

    from gitrecs import similarity

    print("%s should be 0.25" % similarity({'a', 'b'}, {'b', 'c', 'd'}))
    print("%s should be 0.5" % similarity({'a', 'b', 'c'}, {'b', 'c', 'd'}))

Output::

    0.25 should be 0.25
    0.5 should be 0.5

.. -> expected

.. invisible-code-block:: python

    sys.stdout.seek(0)
    output = sys.stdout.read()
    assert output == expected, "%r is not %r" % (output, expected)
    sys.stdout = sys._old_stdout


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
