import { Injectable } from "@angular/core";
import { Effect, Actions, ofType } from "@ngrx/effects";
import { BooksPageActions, BooksApiActions } from "./actions";
import { BooksService } from "../shared/services/book.service";
import {
  mergeMap,
  map,
  catchError,
  exhaustMap,
  concatMap
} from "rxjs/operators";
import { EMPTY } from "rxjs";

@Injectable()
export class BooksApiEffects {
  @Effect()
  loadBooks$ = this.actions$.pipe(
    ofType(BooksPageActions.BooksActionTypes.Enter),
    exhaustMap(() =>
      this.booksService.all().pipe(
        map(books => new BooksApiActions.BooksLoaded(books)),
        catchError(() => EMPTY)
      )
    )
  );

  @Effect()
  createBook$ = this.actions$.pipe(
    ofType(BooksPageActions.BooksActionTypes.CreateBook),
    concatMap(action =>
      this.booksService.create(action.book).pipe(
        map(book => new BooksApiActions.BookCreated(book)),
        catchError(() => EMPTY)
      )
    )
  );

  @Effect()
  updateBook$ = this.actions$.pipe(
    ofType(BooksPageActions.BooksActionTypes.UpdateBook),
    concatMap(action =>
      this.booksService.update(action.book.id, action.book).pipe(
        map(book => new BooksApiActions.BookUpdated(book)),
        catchError(() => EMPTY)
      )
    )
  );

  @Effect()
  deleteBook$ = this.actions$.pipe(
    ofType(BooksPageActions.BooksActionTypes.DeleteBook),
    mergeMap(action =>
      this.booksService.delete(action.book.id).pipe(
        map(() => new BooksApiActions.BookDeleted(action.book)),
        catchError(() => EMPTY)
      )
    )
  );

  constructor(
    private booksService: BooksService,
    private actions$: Actions<
      BooksPageActions.BooksActions | BooksApiActions.BooksApiActions
    >
  ) {}
}
