let style = document.createElement('style')
style.type = 'text/css';
style.innerHTML = `
.ell {
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    --ell-background: rgb(48 49 51);
}

.has-ell {
}

.has-ell:after {
    content: attr(ell-value);
    max-width: 250px;
    position: fixed;
    left: var(--ell-left);
    top: var(--ell-top);
    background-color: var(--ell-background);
    color: #fff;
    text-align: left;
    border-radius: 4px;
    padding: 10px;
    font-size: 12px;
    line-height: 1.2;
    transition: visibility 0.5s, opacity 0.5s;
    visibility: hidden;
    opacity: 0;
    white-space: pre-wrap;
    z-index: 10000;
}

.has-ell:before {
    content: '';
    position: fixed;
    left: var(--ell-angle-left);
    top: var(--ell-angle-top);
    border-width: 5px;
    border-style: solid;
    border-color: var(--ell-background) transparent transparent transparent;
    visibility: hidden;
    opacity: 0;
    transition: visibility 0.5s, opacity 0.5s;
    z-index: 10000;
}

.has-ell:hover:after {
    visibility: visible;
    opacity: 1;
}

.has-ell:hover:before {
    visibility: visible;
    opacity: 1;
}
`
document.querySelector('head').appendChild(style)