function getCurrentUserIconContainer() {
    return `<div class="single__comment__icon current" name="delete">
                <img
                    src="./images/icon-delete.svg"
                    alt="delete icon"
                    class="comment__icon"
                />
                <span class="comment__icon__content">Delete</span>
            </div>
            <div class="single__comment__icon current" name="edit">
                <img
                    src="./images/icon-edit.svg"
                    alt="edit icon"
                    class="comment__icon"
                />
                <span class="comment__icon__content">Edit</span>
            </div>`;
}

function getNotCurrentUserIconContainer() {
    return `<div class="single__comment__icon" name="reply">
                <img
                    src="./images/icon-reply.svg"
                    alt="reply icon"
                    class="comment__icon"
                />
                <span class="comment__icon__content">Reply</span>
            </div>`;
}

export { getCurrentUserIconContainer, getNotCurrentUserIconContainer };
