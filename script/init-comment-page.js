import { getDeleteModal } from "./modal-template.js";

window.onload = () => {
    fetch("../data/data.json")
        .then((result) => result.json())
        .then((data) => {
            initCommentPage(data);
        });
};

const whole_comment_list = document.querySelector(".comment__container > ul");
let current_user = null;

function getSingleComment(comment, current_user) {
    const comment_list = document.createElement("li");
    comment_list.setAttribute("class", "single__comment");
    comment_list.setAttribute("value", `${comment.id}`);

    const comment_container = document.createElement("div");
    comment_container.setAttribute("class", "single__comment__origin");
    comment_container.setAttribute("value", `${comment.id}`);

    comment_container.insertAdjacentHTML(
        "beforeend",
        `<div class="single__comment__recommend">
            <div class="single__comment__recommend__container">
                <button class="recommend__up"></button>
                <span class="recommend__count">${comment.score}</span>
                <button class="recommend__down"></button>
            </div>
        </div>`
    );

    comment_container.insertAdjacentHTML(
        "beforeend",
        `<div class="single__comment__header">
            <div class="single__comment__user__info">
                <img
                    src="./images/avatars/image-${comment.user.username}.webp"
                    alt="user ${comment.user.username}'s photo"
                    class="comment__user__photo"
                />
                <span class="comment__user__name">
                    ${comment.user.username}
                </span>
                <span class="comment__date">
                    ${comment.user.createdAt}
                </span>
            </div>
        </div>`
    );

    if (current_user.username === comment.user.username) {
        comment_container.insertAdjacentHTML(
            "beforeend",
            `<div class="single__comment__icons" value=${comment.id}>
                <div class="single__comment__icon current" name="delete">
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
                </div>
            </div>`
        );
    } else {
        comment_container.insertAdjacentHTML(
            "beforeend",
            `<div class="single__comment__icons" value=${comment.id}>
                <div class="single__comment__icon" name="reply">
                    <img
                        src="./images/icon-reply.svg"
                        alt="reply icon"
                        class="comment__icon"
                    />
                    <span class="comment__icon__content">Reply</span>
                </div>
            </div>`
        );
    }

    if (comment.replyingTo) {
        comment_container.insertAdjacentHTML(
            "beforeend",
            `<div class="single__comment__content">
                <p>
                <span class="reply__to">@${comment.replyingTo}</span>
                    ${comment.content}
                </p>
            </div>`
        );
    } else {
        comment_container.insertAdjacentHTML(
            "beforeend",
            `<div class="single__comment__content">
                <p>
                    ${comment.content}
                </p>
            </div>`
        );
    }

    comment_list.appendChild(comment_container);

    return comment_list;
}

function getWriteComment(current_user) {
    return `
    <div class="comment__write">
        <img
            src="./images/avatars/image-${current_user.username}.webp"
            alt="user ${current_user.username}'s photo"
            class="current__user__image"
        />
        <textarea
            name="comment"
            id="comment__text__input"
            placeholder="Add a comment..."></textarea>
        <button class="comment__send__button">SEND</button>
    </div>
    `;
}

function initCommentPage(json_data) {
    const comments = Array.from(json_data.comments);
    current_user = json_data.currentUser;
    comments.forEach((comment) => {
        const comment_list = getSingleComment(comment, current_user);

        const replies = Array.from(comment.replies);
        if (replies.length > 0) {
            const reply_list_container = document.createElement("div");
            reply_list_container.setAttribute(
                "class",
                "single__comment__reply__user"
            );

            reply_list_container.insertAdjacentHTML(
                "beforeend",
                `
                <div class="single__comment__reply__line">
                    <div class="reply__line"></div>
                </div>`
            );

            const reply_list = document.createElement("ul");
            reply_list.setAttribute("class", "single__comment__reply__list");

            replies.forEach((reply) => {
                reply_list.appendChild(getSingleComment(reply, current_user));
            });
            reply_list_container.insertAdjacentElement("beforeend", reply_list);
            comment_list.insertAdjacentElement(
                "beforeend",
                reply_list_container
            );
        }
        whole_comment_list.appendChild(comment_list);
    });

    const write_container = document.querySelector(
        ".comment__write__container"
    );

    write_container.insertAdjacentHTML(
        "beforeend",
        getWriteComment(current_user)
    );
}

whole_comment_list.addEventListener("click", (event) => {
    const target_element_parent = event.target.parentNode;
    if (target_element_parent.getAttribute("name") === "reply") {
        const target_comment = document.querySelector(
            `.single__comment__origin[value='${target_element_parent.parentNode.getAttribute(
                "value"
            )}']`
        );
        target_comment.insertAdjacentHTML(
            "afterend",
            getWriteComment(current_user)
        );
    } else if (target_element_parent.getAttribute("name") === "delete") {
        document.body.insertAdjacentHTML("beforebegin", getDeleteModal());
    }
});
