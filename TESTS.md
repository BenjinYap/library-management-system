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