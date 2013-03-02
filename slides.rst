:title: Getting started testing
:author: Carl Meyer
:description: a presentation on getting started testing, for PyCon US 2013
:keywords: presentation, python, testing, pycon

:skip-help: true
:data-transition-duration: 400


----

:id: title

Getting started testing
=======================

|hcard|

.. note::

   Thanks for invite (thank Matt, Dave, WebFilings)

   PyCon talk - tell me what sucks!

   How many have written tests? How many measure test coverage?

   (Beginner-level talk, may be review for some, hopefully some new things.)

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

* OSS: pip, virtualenv, Django

.. note::

   A very brief story about me, Python, and testing...

   I like to write tests. Even this slide deck has tests!

   I mostly do web development, but I've tried to keep this talk general.

   I didn't create these things, but I've done a lot of work on them.

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

   Jaccard index is a set metric, and our naive implementation with lists
   doesn't handle duplicates correctly. The union of these should be 2, making
   the similarity score 1/2, but instead we calculate a union of 3 and so get a
   similarity score of 1/3.

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
   that works!

   But we totally rewrote it, better make sure we didn't break anything...

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

:data-reveal: 1

This will get old.
------------------

* Repetitive and boring.

* Not easily reproducible.

* Error-prone.

.. note::

   * What happens with boring tasks? I skip them! Now I'll ship broken code!

   * If it breaks for you, hard to tell another developer how to see the
     breakage.

   * Did I calculate all those results right? Will I do it right next time?

----

:data-reveal: 1

We're software developers!
--------------------------

* Automating boring things is what we do.

.. note::

   We know how to handle boring repetitive tasks, we write software to automate
   them!

----

.. invisible-code-block: python

   import io, sys, types
   sys.modules['gitrecs'] = types.ModuleType('gitrecs')
   sys.modules['gitrecs'].similarity = similarity


``test_gitrecs.py``
-------------------

.. code:: python

   from gitrecs import similarity

   assert similarity({'a', 'b'}, {'b', 'c', 'd'}) == 0.25
   assert similarity({'a', 'b', 'c'}, {'b', 'c', 'd'}) == 0.5

.. note::

   Better! Easily repeatable.

   Hmm, another bug.

----

A bug!
------

.. ignore-next-block
.. code:: python

   from gitrecs import similarity

   assert similarity({}, {}) == 0.0
   assert similarity({'a', 'b'}, {'b', 'c', 'd'}) == 0.25
   assert similarity({'a', 'b', 'c'}, {'b', 'c', 'd'}) == 0.5

::

    Traceback (most recent call last):
      File "test_gitrecs.py", line 3, in <module>
        assert similarity({}, {}) == 0.0
      File "/home/carljm/gitrecs.py", line 14, in similarity
        return len(intersection) / len(union)
    ZeroDivisionError: division by zero

.. note::

   We can fix the bug, but we have a problem with our tests: because the first
   one failed, none of the others ran.

   It'd be better if every test ran every time, pass or fail, so we could get a
   more complete picture of what's broken and what isn't.

----

.. code:: python

   def test_empty():
       assert similarity({}, {}) == 0.0

   def test_quarter():
       assert similarity({'a', 'b'}, {'b', 'c', 'd'}) == 0.25

   def test_half():
       assert similarity({'a'}, {'a', 'b'}) == 0.5

   if __name__ == '__main__':
       for func in test_empty, test_quarter, test_half:
           try:
               func()
           except Exception as e:
               print("{} FAILED: {}".format(func.__name__, e))
           else:
               print("{} passed.".format(func.__name__))

.. note::

   Some code to run each test, catch any exceptions, and report whether the
   test passed or failed.

   Fortunately, we don't have to do this ourselves; there are test runners to
   do it for us!

::

   test_empty FAILED: division by zero
   test_quarter passed.
   test_half passed.


----

.. code:: python

   from gitrecs import similarity

   def test_empty():
       assert similarity({}, {}) == 0.0

   def test_quarter():
       assert similarity({'a', 'b'}, {'b', 'c', 'd'}) == 0.25

   def test_half():
       assert similarity({'a'}, {'a', 'b'}) == 0.5

----

pip install pytest
------------------

----

::

   $ py.test
   =================== test session starts ===================
   platform linux -- Python 3.3.0 -- pytest-2.3.4
   collected 3 items

   test_gitrecs.py F..

   ======================== FAILURES =========================
   _______________________ test_empty ________________________

       def test_empty():
   >       assert similarity({}, {}) == 0.0

   test_gitrecs.py:4:
   _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _

       def similarity(watched1, watched2):
           intersection = watched1.intersection(watched2)
           union = watched1.union(watched2)
   >       return len(intersection) / len(union)
   E       ZeroDivisionError: division by zero

   gitrecs.py:14: ZeroDivisionError
   =========== 1 failed, 2 passed in 0.02 seconds ============

----

Just for kicks:
---------------

.. ignore-next-block
.. code:: python

   import pytest

   from gitrecs import similarity

   @pytest.mark.parametrize('data', [
       (({}, {}), 0.0),
       (({'a', 'b'}, {'b', 'c', 'd'}), 0.25),
       (({'a'}, {'a', 'b'}), 0.5)
       ])
   def test_similarity(data):
       args, expected = data
       assert similarity(*args) == expected

----

Now let's fix that bug.
-----------------------

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

       if not union:
           return 0.0
       return len(intersection) / len(union)

----

Tests pass! Ship it!
--------------------

::

   $ py.test
   =================== test session starts ===================
   platform linux -- Python 3.3.0 -- pytest-2.3.4
   collected 3 items

   test_gitrecs.py ...

   ================ 3 passed in 0.02 seconds =================


----

:data-reveal: 1

Why write tests?
----------------

#. Tests tell you when your code is broken.

#. Tests improve the design of your code.

.. note::

   #. ... as we just saw. "More fun to write tests on weekdays than fix bugs on
      weekends."

   #. ...if you listen. How? Let's look at an example.

----

Never show your first draft
~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. code:: python

   class GithubUser:
       def get_watched_repos(self):
           """Return this user's set of watched repos."""
           # ... GitHub API querying happens here ...

   def similarity(user1, user2):
       """Return similarity score for given users."""
       watched1 = user1.get_watched_repos()
       watched2 = user2.get_watched_repos()

       # ... same Jaccard index code ...

.. note::

   You may have been thinking, of course tests are easy to write when you're
   testing nice simple pure functions like that similarity function.

   Here's a secret: that nice simple pure function wasn't the first version of
   similarity that I wrote. The first version looked more like this.

   Imagine writing tests for this similarity function.

----

Harder to test
--------------

.. code:: python

   class FakeGithubUser:
       def __init__(self, watched):
           self.watched = watched

       def get_watched_repos(self):
           return watched

   def test_similarity():
       assert similarity(
           FakeGithubUser({'a'}),
           FakeGithubUser({'a', 'b'})
           ) == 0.5

.. note::

   We take advantage of duck-typing and create a fake replacement for
   GithubUser that doesn't go out and query the GitHub API, it just returns
   whatever we tell it to.

   This is a fine testing technique when testing code that has an unavoidable
   collaborator. But when you have to do this, it should cause you to ask
   yourself if it's essential to what you want to test, or if the design of
   your code is making testing harder than it should be.

   In this case, the collaborator is avoidable. What we really want to test is
   the similarity calculation; GithubUser is an irrelevant distraction. We can
   extract a similarity function that operates just on sets of repos so it
   doesn't need to know anything about the GithubUser class, and then our tests
   become much simpler.

----

:data-reveal: 1

Testable is maintainable
------------------------

* Code maintenance is managing change.

* The less a function knows about the world, the more robust it is against
  changes in the world (principle of least knowledge).

* The less a function knows about the world, the less of the world you
  have to set up in order to test it.

.. note::

   Function (or class, or module - whatever the system under test)

   In this case, similarity is harder to test if it knows about GithubUser,
   because we have to set up a GithubUser (or a fake one) to feed to it for
   every test. And it's also more fragile, because if the name of the
   get_watched_repos method changes, it will break.

   It knows more than it needs to know to do its job! By narrowing its vision
   of the world, we make it both easier to test and easier to maintain.

----



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
