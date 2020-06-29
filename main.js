"use strict";
let listData = [];
let listEl;
let filterInputEl;
const icons = {
    openVSCode: `<svg width="24px" height="24px" viewBox="0 0 24 24">
    <path class="st1" d="M20.4,4.9l-3.7-1.8C16.3,3,15.8,3,15.5,3.3c0,0-0.1,0.1-0.1,0.1L8.3,9.8L5.2,7.5c-0.3-0.2-0.7-0.2-1,0l-1,0.9 c-0.3,0.3-0.3,0.8,0,1.1L5.9,12l-2.7,2.4c-0.3,0.3-0.3,0.8,0,1.1l1,0.9c0.3,0.2,0.7,0.3,1,0l3.1-2.3l7.1,6.5 c0.1,0.1,0.2,0.2,0.4,0.3c0.3,0.1,0.6,0.1,0.9,0l3.7-1.8c0.4-0.2,0.6-0.6,0.6-1V6C21,5.5,20.8,5.1,20.4,4.9z M16.5,16.1L11.1,12 l5.4-4.1V16.1z"/>
</svg>`,
};
const regexp = {
    filterQueryUnifier: /(-|\.|_| )/g
};
const init = () => {
    listData = window.listData;
    listEl = document.getElementById('listContainer');
    filterInputEl = document.getElementById('filterInput');
    window.addEventListener('keypress', () => {
        filterInputEl.focus();
    });
    filterInputEl.addEventListener('input', () => {
        const q = filterInputEl.value.trim();
        render(sort(filter(listData, q)), q != "" ? q : null);
    });
    render(sort(listData));
};
const sort = (arr) => {
    arr.sort((a, b) => {
        if (a.type == b.type) {
            return a.target.localeCompare(b.target);
        }
        else {
            return a.type.localeCompare(b.type);
        }
    });
    return arr;
};
const filter = (arr, query) => {
    const q = query.toLocaleLowerCase().replace(regexp.filterQueryUnifier, '');
    return arr.filter(item => {
        const parts = [item.target];
        if (item.subtarget)
            parts.push(item.subtarget);
        let score = 0;
        parts.forEach(part => {
            const v = part.toLocaleLowerCase().replace(regexp.filterQueryUnifier, '');
            const s = v.indexOf(q);
            score += s;
        });
        return score > -1 * parts.length;
    });
};
const render = (arr, highlight = null) => {
    while (listEl.firstChild) {
        listEl.removeChild(listEl.firstChild);
    }
    arr.forEach(data => {
        const row = document.createElement('div');
        row.classList.add('list-item');
        const content = document.createElement('div');
        content.classList.add('list-item-content');
        row.appendChild(content);
        const targetLink = document.createElement('a');
        targetLink.classList.add('button');
        targetLink.href = `./${data.target}`;
        targetLink.appendChild(getHighlighedText(data.target, highlight));
        content.appendChild(targetLink);
        const subtargetLink = document.createElement('a');
        subtargetLink.classList.add('button');
        if (data.subtarget != null) {
            subtargetLink.href = `./${data.target}/${data.subtarget}`;
            subtargetLink.appendChild(getHighlighedText(data.subtarget, highlight));
            subtargetLink.classList.add('default');
            // content.appendChild(document.createTextNode('→'));
            content.appendChild(document.createTextNode('/'));
            content.appendChild(subtargetLink);
        }
        else {
            targetLink.classList.add('default');
        }
        const separator = document.createElement('span');
        separator.classList.add('flexspace');
        content.appendChild(separator);
        const editorLink = document.createElement('a');
        editorLink.classList.add('icon-button');
        editorLink.href = `vscode://file/${data.path}`;
        editorLink.insertAdjacentHTML('afterbegin', icons.openVSCode);
        content.appendChild(editorLink);
        listEl.appendChild(row);
        row.addEventListener('click', e => {
            const target = e.target;
            if (target != targetLink && target != subtargetLink && target != editorLink) {
                if (data.subtarget) {
                    subtargetLink.click();
                }
                else {
                    targetLink.click();
                }
            }
        });
    });
};
const getHighlighedText = (text, highlight) => {
    const container = document.createElement('span');
    if (highlight != null) {
        const q = highlight.trim().toLocaleLowerCase();
        const index = text.toLocaleLowerCase().indexOf(q);
        if (index > -1) {
            const p1 = text.substring(0, index);
            const p2 = text.substring(index, index + highlight.length);
            const p3 = text.substring(index + highlight.length);
            const targetMask = document.createElement('mark');
            targetMask.textContent = p2;
            container.appendChild(document.createTextNode(p1));
            container.appendChild(targetMask);
            container.appendChild(document.createTextNode(p3));
        }
        else {
            container.textContent = text;
        }
    }
    else {
        container.textContent = text;
    }
    return container;
};
if (document.readyState != "loading") {
    init();
}
else {
    window.addEventListener("DOMContentLoaded", () => init());
}
