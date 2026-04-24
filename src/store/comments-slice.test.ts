import { addComment, fetchComments } from './api-actions.ts';
import { commentsReducer } from './comments-slice.ts';
import { makeFakeReview } from '../utils/mock-data.ts';

describe('commentsReducer', () => {
  const review = makeFakeReview();

  it('returns initial state with unknown action', () => {
    expect(commentsReducer(undefined, { type: 'UNKNOWN_ACTION' })).toEqual({
      comments: [],
      loading: false,
      error: null,
    });
  });

  it('handles fetchComments.fulfilled', () => {
    const state = commentsReducer(
      undefined,
      fetchComments.fulfilled([review], '', '1'),
    );

    expect(state.comments).toEqual([review]);
    expect(state.loading).toBe(false);
  });

  it('handles fetchComments.rejected', () => {
    const state = commentsReducer(
      undefined,
      fetchComments.rejected(null, '', '1'),
    );

    expect(state.error).toBe('Failed to load comments');
    expect(state.loading).toBe(false);
  });

  it('handles addComment.rejected', () => {
    const state = commentsReducer(
      undefined,
      addComment.rejected(null, '', { offerId: '1', comment: 'Test', rating: 5 }),
    );

    expect(state.error).toBe('Failed to post comment');
  });

  it('handles addComment.fulfilled', () => {
    const existingReview = makeFakeReview('1');
    const newReview = makeFakeReview('2');
    const state = commentsReducer(
      {
        comments: [existingReview],
        loading: false,
        error: 'Failed to post comment',
      },
      addComment.fulfilled(newReview, '', {
        offerId: '1',
        comment: newReview.comment,
        rating: newReview.rating,
      }),
    );

    expect(state.comments).toEqual([newReview, existingReview]);
    expect(state.error).toBeNull();
  });
});
