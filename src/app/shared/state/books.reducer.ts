import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { Book } from "src/app/shared/models/book.model";
import { BooksPageActions, BooksApiActions } from "src/app/books/actions";
import { createSelector, on, createReducer, Action } from "@ngrx/store";

export const initialBooks: Book[] = [
  {
    id: "1",
    name: "Fellowship of the Ring",
    earnings: 100000000,
    description: "The start"
  },
  {
    id: "2",
    name: "The Two Towers",
    earnings: 200000000,
    description: "The middle"
  },
  {
    id: "3",
    name: "The Return of The King",
    earnings: 400000000,
    description: "The end"
  }
];

export interface State extends EntityState<Book> {
  activeBookId: string | null;
}

export const adapter = createEntityAdapter<Book>();

export const initialState = adapter.getInitialState({
  activeBookId: null
});

const booksReducer = createReducer(
  initialState,
  on(BooksApiActions.booksLoaded, 
    (state, { books }) => adapter.addAll(books, state)
  ),
  on(BooksPageActions.selectBook,
    (state, { bookId }) => ({ ...state, activeBookId: bookId })
  ),
  on(BooksPageActions.clearSelectedBook, 
    state => ({ ...state,activeBookId: null })
  ),
  on(BooksApiActions.bookCreated, 
    (state, { book }) => adapter.addOne(book, {
      ...state,
      activeBookId: book.id
    })
  ),
  on(BooksApiActions.bookUpdated, 
    (state, { book }) => adapter.updateOne(
      { id: book.id, changes: book },
      { ...state, activeBookId: book.id }
    )
  ),
  on(BooksApiActions.bookDeleted, 
    (state, { book }) => adapter.removeOne(book.id, {
      ...state,
      activeBookId: null
    })
  )
);

export function reducer(
  state = initialState,
  action: Action
): State {
  return booksReducer(state, action);
}

export const { selectAll, selectEntities } = adapter.getSelectors();
export const selectActiveBookId = (state: State) => state.activeBookId;
export const selectActiveBook = createSelector(
  selectEntities,
  selectActiveBookId,
  (entities, bookId) => (bookId ? entities[bookId] : null)
);
export const selectEarningsTotals = createSelector(
  selectAll,
  books =>
    books.reduce((total, book) => {
      return total + parseInt(`${book.earnings}`, 10) || 0;
    }, 0)
);
