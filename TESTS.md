* Always mock the minimum amount of db rows required.
* Never touch any other tests unless instructed to.
* Never assert things that are pointless or would be caught via exception anyways, such as asserting the body exists.

# frontend
* none so far
# backend
* /api/books
  * test 1
    * assert book that is available is returned in the result
  * test 2
    * assert that when there are books but none are available, no results are returned
* /api/books/borrored
  * test 1
    * assert a 400 response when the user id param doesn't exist
  * test 2
    * assert an empty response when the user has no borrowed books
  * test 3
    * assert two specific books are returned when the user has those two books borrowed
    * assert the borrowed datetimes are correct