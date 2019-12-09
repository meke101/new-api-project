exports.formatDates = articles => {
  const copyArticles = [...articles];
  copyArticles.forEach(article => {
    const formattedDate = new Date(article.created_at);
    article.created_at = formattedDate;
  });
  return copyArticles;
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
  copyComments.map(comment => {
    comment.article_id = comment.belongs_to;
    comment.author = comment.created_by;
    delete comment.belongs_to;
    delete comment.created_by;
    delete comment.title;
  });

  copyComments.forEach(comment => {
    const currentId = comment.article_id;
    console.log(currentId);
    const newId = articleRef[currentId];
    comment.article_id = newId;
  });

  console.log(copyComments[0]);
  return copyComments;
};
