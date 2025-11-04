/*console.log(document.getElementById('plant1'));
dragElement(document.getElementById('plant1'));
dragElement(document.getElementById('plant2'));
dragElement(document.getElementById('plant3'));
dragElement(document.getElementById('plant4'));
dragElement(document.getElementById('plant5'));
dragElement(document.getElementById('plant6'));
dragElement(document.getElementById('plant7'));
dragElement(document.getElementById('plant8'));
dragElement(document.getElementById('plant9'));
dragElement(document.getElementById('plant10'));
dragElement(document.getElementById('plant11'));
dragElement(document.getElementById('plant12'));
dragElement(document.getElementById('plant13'));
dragElement(document.getElementById('plant14'));

let topZ = 10;

function dragElement(terrariumElement) {
    let pos1 = 0,
        pos2 = 0,
        pos3 = 0,
        pos4 = 0;
    
    terrariumElement.onpointerdown = pointerDrag;

    if (!terrariumElement.style.zIndex) {
        terrariumElement.style.zIndex = '2';
    }

    terrariumElement.ondblclick = function () {
        terrariumElement.style.zIndex = (++topZ).toString();
        topZ += 1
    };

    terrariumElement.onpointerup = function () {
        terrariumElement.style.zIndex = (++topZ).toString();
        topZ += 1
    };

    function pointerDrag(e) {
        e.preventDefault();
        console.log(e);
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onpointermove = elementDrag;
        document.onpointerup = stopElementDrag;
    }

    function elementDrag(e) {
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        console.log(pos1, pos2, pos3, pos4);
        terrariumElement.style.top = terrariumElement.offsetTop - pos2 + 'px';
        terrariumElement.style.left = terrariumElement.offsetLeft - pos1 + 'px';
    }

    function stopElementDrag() {
        document.onpointerup = null;
        document.onpointermove = null;
    }
    
}*/

(() => {
  'use strict';

  const DRAG_TYPE_ID   = 'text/x-plant-id';
  const DRAG_TYPE_META = 'application/x-plant-meta';

  let currentDragMeta = null;

  let topZ = 0;
  function initTopZ() {
    topZ = Array.from(document.querySelectorAll('.plant'))
      .reduce((m, el) => {
        const z = parseInt(getComputedStyle(el).zIndex, 10);
        return Number.isNaN(z) ? m : Math.max(m, z);
      }, 0);
  }

  function getJarScale() {
    const raw = getComputedStyle(document.documentElement)
      .getPropertyValue('--plant-in-jar-scale').trim();
    const n = parseFloat(raw);
    return Number.isNaN(n) ? 0.25 : n;
  }

  function isInsideJar(clientX, clientY) {
    const jar = document.querySelector('.jar-walls')
            || document.querySelector('#jar')
            || document.querySelector('.jar');
    if (!jar) return false;
    const r = jar.getBoundingClientRect();
    return clientX >= r.left && clientX <= r.right &&
           clientY >= r.top  && clientY <= r.bottom;
  }

  function elevateJarOverlay() {
    const sels = ['.jar-walls', '.jar-top', '.jar-bottom', '.jar-glossy-long', '.jar-glossy-short'];
    sels.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => {
        if (!el) return;
        if (!getComputedStyle(el).position || getComputedStyle(el).position === 'static') {
          el.style.position = 'absolute';
        }
        el.style.zIndex = '10000';
        el.style.pointerEvents = 'none';
      });
    });
  }

  function onDragStart(e) {
    const t = e.target;
    if (!(t instanceof Element) || !t.classList.contains('plant')) return;

    if (!t.id) {
      const uid = (globalThis.crypto?.randomUUID?.() ||
                  `p-${Date.now()}-${Math.random().toString(16).slice(2)}`);
      t.id = uid;
    }

    const rect = t.getBoundingClientRect();
    const offsetVisX = e.clientX - rect.left;
    const offsetVisY = e.clientY - rect.top;

    const startScale = t.classList.contains('in-jar') ? getJarScale() : 1;

    currentDragMeta = { id: t.id, ox: offsetVisX, oy: offsetVisY, sc: startScale };

    e.dataTransfer.setData(DRAG_TYPE_ID, t.id);
    e.dataTransfer.setData(DRAG_TYPE_META, JSON.stringify(currentDragMeta));
    e.dataTransfer.effectAllowed = 'move';
  }

  function onDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }

  function onDrop(e) {
    e.preventDefault();

    const id = e.dataTransfer.getData(DRAG_TYPE_ID) || currentDragMeta?.id;
    if (!id) return;

    const el = document.getElementById(id);
    if (!el) return;

    let meta = null;
    try { meta = JSON.parse(e.dataTransfer.getData(DRAG_TYPE_META)); } catch {}
    if (!meta && currentDragMeta && currentDragMeta.id === id) meta = currentDragMeta;
    const offsetVisX = meta?.ox ?? 0;
    const offsetVisY = meta?.oy ?? 0;
    const startScale  = meta?.sc ?? (el.classList.contains('in-jar') ? getJarScale() : 1);

    const pageX = e.clientX + window.scrollX;
    const pageY = e.clientY + window.scrollY;

    const inJarNow = isInsideJar(e.clientX, e.clientY);
    const newScale = inJarNow ? getJarScale() : 1;

    const offsetCssX = offsetVisX / startScale;
    const offsetCssY = offsetVisY / startScale;

    el.style.position = 'absolute';
    el.style.left = `${pageX - offsetCssX * newScale}px`;
    el.style.top  = `${pageY - offsetCssY * newScale}px`;

    if (el.parentElement !== document.body) {
      document.body.appendChild(el);
    }

    if (inJarNow) el.classList.add('in-jar');
    else          el.classList.remove('in-jar');

    el.style.zIndex = String(++topZ);
  }

  function onDragEnd() {
    currentDragMeta = null;
  }

  function setup() {
    initTopZ();
    elevateJarOverlay();

    document.querySelectorAll('.plant').forEach(el => {
      el.setAttribute('draggable', 'true');
      el.style.userSelect = 'none';
      el.style.webkitUserDrag = 'element';
    });

    document.addEventListener('dragstart', onDragStart);
    document.addEventListener('dragover',  onDragOver);
    document.addEventListener('drop',      onDrop);
    document.addEventListener('dragend',   onDragEnd);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup);
  } else {
    setup();
  }
})();
