const BookIssueCard = ({ issuedBookData }: { issuedBookData: any }) => {
  const HandleReturn = () => {
    const issuedBooks = JSON.parse(localStorage.getItem('issuedBooks') || '[]');
    const updatedIssuedBooks = issuedBooks.filter((book: any) => book.issueId !== issuedBookData.issueId);
    localStorage.setItem('issuedBooks', JSON.stringify(updatedIssuedBooks));
    const books = JSON.parse(localStorage.getItem('books') || '[]');
    const updatedBooks = books.map((book: any) => {
      if (book.title === issuedBookData.bookTitle) {
        book.booksCount += 1;
      }
      return book;
    });
    localStorage.setItem('books', JSON.stringify(updatedBooks));
    window.location.reload();
  }

  return (
    <article className="flex justify-between py-6 border-b border-purple-200">
        <div className="w-1/4"><span className="font-semibold">Issued To:</span> {issuedBookData.studentName}</div>
        <div className="w-1/4"><span className="font-semibold">Book Title:</span> {issuedBookData.bookTitle}</div>
        <div className="w-1/4"><span className="font-semibold">Issue Date:</span> {issuedBookData.date}</div>
        <div className="w-1/4 underline text-zinc-500 cursor-pointer" onClick={HandleReturn}>Return</div>
    </article>
  )
}

export default BookIssueCard
