function getDeleteModal() {
    return `<div class="modal__container">
        <div class="modal__background"></div>
        <div class="modal__container__message">
            <h3 class="modal__container__header">Delete comment</h3>
            <p class="modal__container__content">
                Are you sure you want to delete this comment? This will
                remove the comment and can't be undone.
            </p>
            <div class="modal__container__buttons">
                <button class="modal__cancel">NO, CANCEL</button>
                <button class="modal__delete">YES, DELETE</button>
            </div>
        </div>
    </div>`;
}

export { getDeleteModal };
