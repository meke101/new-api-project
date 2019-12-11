exports.formatDates = list => {
  const copyList = [...list];

  return copyList.map(item => {
    const newItem = { ...item };
    newItem.created_at = new Date(newItem.created_at);
    return newItem;
  });
};

exports.makeRefObj = list => {
  const copyList = [...list];
  const reference = {};

  copyList.forEach(item => {
    const copyItem = { ...item };
    reference[copyItem.title] = copyItem.article_id;
  });
  return reference;
};

exports.formatComments = (comments, articleRef) => {
  const copyComments = [...comments];
  const formattedComments = copyComments.map(comment => {
    const newComment = { ...comment };
    newComment.created_at = new Date(comment.created_at);

    newComment.author = newComment.created_by;
    delete newComment.created_by;

    newComment.article_id = articleRef[comment.belongs_to];
    delete newComment.belongs_to;
    return newComment;
  });

  return formattedComments;
};
