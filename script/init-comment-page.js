import { getDeleteModal } from "./modal-template.js";
import { getCurrentUserIconContainer, getNotCurrentUserIconContainer } from "./comment-template.js";

window.onload = () => {
    fetch("../data/data.json")
        .then((result) => result.json())
        .then((data) => {
            initCommentPage(data);
        });
};

const whole_comment_list = document.querySelector(".comment__container > ul");
const comment_write_container = document.querySelector(".comment__write__container");
let new_write_element = null;
let current_user = null;

let whole_comment_count = 0;

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
                    ${comment.createdAt}
                </span>
            </div>
        </div>`
    );

    comment_container.insertAdjacentHTML(
        "beforeend",
        `<div class="single__comment__icons" value=${comment.id}>
            ${current_user.username === comment.user.username ? getCurrentUserIconContainer() : getNotCurrentUserIconContainer()}
        </div>`
    );

    comment_container.insertAdjacentHTML(
        "beforeend",
        `<div class="single__comment__content">
            <p>
            ${comment.replyingTo ? `<span class="reply__to">@${comment.replyingTo}</span>` : ``}
                ${comment.content}
            </p>
        </div>`
    );

    comment_list.appendChild(comment_container);

    return comment_list;
}

function getWriteComment(current_user) {
    const comment_write_container = document.createElement("div");
    comment_write_container.setAttribute("class", "comment__write");
    comment_write_container.insertAdjacentHTML(
        "beforeend",
        `<img
            src="./images/avatars/image-${current_user.username}.webp"
            alt="user ${current_user.username}'s photo"
            class="current__user__image"
        />
        <textarea
            name="comment"
            id="comment__text__input"
            placeholder="Add a comment..."></textarea>
        <button class="comment__send__button">SEND</button>`
    );
    return comment_write_container;
}

function initCommentPage(json_data) {
    const comments = Array.from(json_data.comments);
    current_user = json_data.currentUser;
    comments.forEach((comment) => {
        const comment_list = getSingleComment(comment, current_user);

        const replies = Array.from(comment.replies);
        if (replies.length > 0) {
            const reply_list_container = document.createElement("div");
            reply_list_container.setAttribute("class", "single__comment__reply__user");

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
                whole_comment_count++;
            });
            reply_list_container.insertAdjacentElement("beforeend", reply_list);
            comment_list.insertAdjacentElement("beforeend", reply_list_container);
        }
        whole_comment_list.appendChild(comment_list);
        whole_comment_count++;
    });

    const write_container = document.querySelector(".comment__write__container");

    write_container.insertAdjacentElement("beforeend", getWriteComment(current_user));
}

function getReplyCommentObject(comment_content, reply_to, comment_score = 0) {
    return {
        id: ++whole_comment_count,
        content: comment_content,
        createdAt: "now",
        score: comment_score,
        user: {
            image: {
                png: current_user.image.png,
                webp: current_user.image.webp,
            },
            username: current_user.username,
        },
        replyingTo: reply_to,
    };
}

function getCommentObject(comment_content, comment_score = 0) {
    return {
        id: ++whole_comment_count,
        content: comment_content,
        createdAt: "now",
        score: comment_score,
        user: {
            image: {
                png: current_user.image.png,
                webp: current_user.image.webp,
            },
            username: current_user.username,
        },
        replies: [],
    };
}

function transformCommentToEdit(target_comment, target_comment_content, target_comment_info) {
    const new_comment_container = getWriteComment(current_user);
    new_comment_container.querySelector("textarea").value = target_comment_content;
    target_comment.insertAdjacentElement("afterend", new_comment_container);
    target_comment.remove();
    new_comment_container.addEventListener("click", (event) => {
        if (event.target.classList.contains("comment__send__button")) {
            target_comment_info.content = new_comment_container.querySelector("textarea").value;
            new_comment_container.insertAdjacentElement("afterend", getSingleComment(target_comment_info, current_user));
            new_comment_container.remove();
        }
    });
}

function removeWriteCommentContainer() {
    new_write_element.remove();
    new_write_element = null;
}

function getTargetComment(target_element_parent) {
    return document.querySelector(`.single__comment__origin[value='${target_element_parent.parentNode.getAttribute("value")}']`);
}

document.body.addEventListener("click", (event) => {
    const target_element = event.target;
    if (target_element.parentNode) {
        const target_element_parent = target_element.parentNode;

        if (target_element_parent.getAttribute("name") === "reply") {
            if (!new_write_element) {
                const target_comment = getTargetComment(target_element_parent);
                new_write_element = getWriteComment(current_user);

                target_comment.insertAdjacentElement("afterend", new_write_element);
                new_write_element.querySelector("textarea").focus();
                console.log(target_comment);
                console.log(target_comment.parentElement);
                new_write_element.addEventListener("click", (event) => {
                    if (event.target.classList.contains("comment__send__button")) {
                        const new_comments = getReplyCommentObject(new_write_element.querySelector("textarea").value, target_comment.querySelector(".comment__user__name").textContent.trim());
                        if (target_comment.querySelector(".reply__to")) {
                            if (target_comment.querySelector("single__comment__content span")) {
                                target_comment.insertAdjacentElement("afterend", getSingleComment(new_comments, current_user));
                            } else {
                                target_comment.parentElement.insertAdjacentElement("beforeend", getSingleComment(new_comments, current_user));
                            }
                        } else if (target_comment.parentElement.querySelector(".single__comment__reply__user")) {
                            target_comment.parentElement.querySelector(".single__comment__reply__list").insertAdjacentElement("beforeend", getSingleComment(new_comments, current_user));
                        } else {
                            const reply_container = document.createElement("div");
                            reply_container.setAttribute("class", "single__comment__reply__user");
                            reply_container.insertAdjacentHTML(
                                "beforeend",
                                `<div class="single__comment__reply__line">
                                    <div class="reply__line"></div>
                                </div>`
                            );

                            const reply_list = document.createElement("ul");
                            reply_list.setAttribute("class", "single__comment__reply__list");
                            reply_list.insertAdjacentElement("beforeend", getSingleComment(new_comments, current_user));
                            reply_container.insertAdjacentElement("beforeend", reply_list);
                            target_comment.parentElement.insertAdjacentElement("beforeend", reply_container);
                        }
                        removeWriteCommentContainer();
                    }
                });
            }
        } else if (target_element_parent.getAttribute("name") === "delete") {
            const target_comment = getTargetComment(target_element_parent);
            document.body.insertAdjacentHTML("beforebegin", getDeleteModal());
            const modal = document.querySelector(".modal__container");
            modal.addEventListener("click", (event) => {
                if (event.target.classList.contains("modal__background") || event.target.classList.contains("modal__cancel")) {
                    modal.remove();
                } else if (event.target.classList.contains("modal__delete")) {
                    target_comment.remove();
                    modal.remove();
                }
            });
        } else if (target_element_parent.getAttribute("name") === "edit") {
            const target_comment = getTargetComment(target_element_parent);
            const target_comment_text = target_comment.querySelector(".single__comment__content > p").textContent;
            const target_comment_recommend_count = parseInt(target_comment.querySelector(".recommend__count").textContent);

            const reply_contain_regex = /(?<=@)(?<target_comment_reply_to>[^\s]*)[\s]*(?<target_comment_content>.*)/;
            const reply_not_contain_regex = /[\s]*(?<target_comment_content>.*)/;

            if (target_comment.querySelector(".single__comment__content span")) {
                const {
                    groups: { target_comment_reply_to, target_comment_content },
                } = reply_contain_regex.exec(target_comment_text);
                const target_comment_info = getReplyCommentObject(target_comment_content, target_comment_reply_to, target_comment_recommend_count);
                transformCommentToEdit(target_comment, target_comment_content, target_comment_info);
            } else {
                const {
                    groups: { target_comment_content },
                } = reply_not_contain_regex.exec(target_comment_text);

                const target_comment_info = getCommentObject(target_comment_content, target_comment_recommend_count);
                transformCommentToEdit(target_comment, target_comment_content, target_comment_info);
            }
        } else if (target_element.classList.contains("recommend__up")) {
            target_element.nextElementSibling.textContent = parseInt(target_element.nextElementSibling.textContent) + 1;
        } else if (target_element.classList.contains("recommend__down")) {
            target_element.previousElementSibling.textContent = parseInt(target_element.previousElementSibling.textContent) - 1;
        } else if (new_write_element && !new_write_element.contains(target_element)) {
            removeWriteCommentContainer();
        }
    }
});

comment_write_container.addEventListener("click", (event) => {
    if (event.target.classList.contains("comment__send__button")) {
        const new_comments = {
            id: ++whole_comment_count,
            content: comment_write_container.querySelector("textarea").value,
            createdAt: "now",
            score: 0,
            user: {
                image: {
                    png: current_user.image.png,
                    webp: current_user.image.webp,
                },
                username: current_user.username,
            },
            replies: [],
        };
        event.target.previousElementSibling.value = "";
        whole_comment_list.insertAdjacentElement("beforeend", getSingleComment(new_comments, current_user));
    }
});
