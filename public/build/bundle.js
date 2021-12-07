
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : options.context || []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.42.1' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    const createMenu = () => {
      const { subscribe, set, update } = writable(false);
      return { subscribe, toggle: () => update((isOpen) => !isOpen) };
    };

    const menu = createMenu();

    /* src\components\Header.svelte generated by Svelte v3.42.1 */
    const file$7 = "src\\components\\Header.svelte";

    function create_fragment$7(ctx) {
    	let header;
    	let div0;
    	let svg;
    	let path;
    	let t0;
    	let h4;
    	let t2;
    	let div1;
    	let img;
    	let img_src_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			header = element("header");
    			div0 = element("div");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			t0 = space();
    			h4 = element("h4");
    			h4.textContent = "Menu";
    			t2 = space();
    			div1 = element("div");
    			img = element("img");
    			attr_dev(path, "d", "M79.5746 57H0V42.75H79.5746V57ZM48.6289 14.25H0V0H48.6289V14.25Z");
    			add_location(path, file$7, 15, 6, 405);
    			attr_dev(svg, "viewBox", "0 0 80 57");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "class", "fill-current text-ProtaBlack h-4");
    			add_location(svg, file$7, 9, 4, 250);
    			attr_dev(h4, "class", " font-semibold font-serif text-base lg:text-lg");
    			add_location(h4, file$7, 19, 4, 516);
    			attr_dev(div0, "class", "mx-4 my-4 px-4 flex items-center space-x-2 modal-open");
    			add_location(div0, file$7, 5, 2, 140);
    			attr_dev(img, "class", " object-contain h-10 lg:h-14 w-full");
    			if (!src_url_equal(img.src, img_src_value = "/assets/logo1.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Logo");
    			add_location(img, file$7, 22, 4, 662);
    			attr_dev(div1, "class", "mx-4 my-4 px-4 text-center flex items-center");
    			add_location(div1, file$7, 21, 2, 598);
    			attr_dev(header, "class", "bg-gray-50 h-24 flex justify-between pt-6 sticky top-0");
    			add_location(header, file$7, 4, 0, 65);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);
    			append_dev(header, div0);
    			append_dev(div0, svg);
    			append_dev(svg, path);
    			append_dev(div0, t0);
    			append_dev(div0, h4);
    			append_dev(header, t2);
    			append_dev(header, div1);
    			append_dev(div1, img);

    			if (!mounted) {
    				dispose = listen_dev(div0, "click", menu.toggle, false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Header', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Header> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ menu });
    	return [];
    }

    class Header extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Header",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /* src\components\Menu.svelte generated by Svelte v3.42.1 */
    const file$6 = "src\\components\\Menu.svelte";

    function create_fragment$6(ctx) {
    	let div6;
    	let div0;
    	let svg;
    	let path;
    	let t0;
    	let div5;
    	let div3;
    	let div1;
    	let h20;
    	let t2;
    	let h21;
    	let t4;
    	let h22;
    	let t6;
    	let div2;
    	let h30;
    	let t8;
    	let h31;
    	let t10;
    	let h32;
    	let t12;
    	let div4;
    	let img;
    	let img_src_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div6 = element("div");
    			div0 = element("div");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			t0 = space();
    			div5 = element("div");
    			div3 = element("div");
    			div1 = element("div");
    			h20 = element("h2");
    			h20.textContent = "Proyects";
    			t2 = space();
    			h21 = element("h2");
    			h21.textContent = "About me";
    			t4 = space();
    			h22 = element("h2");
    			h22.textContent = "Contact me";
    			t6 = space();
    			div2 = element("div");
    			h30 = element("h3");
    			h30.textContent = "Behance";
    			t8 = space();
    			h31 = element("h3");
    			h31.textContent = "LinkedIn";
    			t10 = space();
    			h32 = element("h3");
    			h32.textContent = "Polywork";
    			t12 = space();
    			div4 = element("div");
    			img = element("img");
    			attr_dev(path, "d", "M17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41L17.59 5Z");
    			add_location(path, file$6, 17, 6, 349);
    			attr_dev(svg, "class", "fill-current text-gray-50 h-8");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			add_location(svg, file$6, 16, 4, 278);
    			attr_dev(div0, "class", "\r\n\t\t\t\t\t\tabsolute\r\n\t\t\t\t\t\ttop-0\r\n\t\t\t\t\t\tright-0\r\n\t\t\t\t\t\tcursor-pointer\r\n\t\t\t\t\t\tflex flex-col\r\n\t\t\t\t\t\tp-6\r\n\t\t\t\t\t");
    			add_location(div0, file$6, 5, 2, 116);
    			add_location(h20, file$6, 28, 8, 744);
    			add_location(h21, file$6, 29, 8, 771);
    			add_location(h22, file$6, 30, 8, 798);
    			attr_dev(div1, "class", " text-4xl lg:text-5xl space-y-8 ml-8 ");
    			add_location(div1, file$6, 27, 6, 683);
    			add_location(h30, file$6, 33, 8, 905);
    			add_location(h31, file$6, 34, 8, 931);
    			add_location(h32, file$6, 35, 8, 958);
    			attr_dev(div2, "class", " text-2xl lg:text-3xl space-y-6 ml-8 mt-8 ");
    			add_location(div2, file$6, 32, 6, 839);
    			attr_dev(div3, "class", " flex flex-col mt-40 md:mt-28 text-gray-50 font-serif font-semibold");
    			add_location(div3, file$6, 24, 4, 581);
    			attr_dev(img, "class", " object-contain h-36 w-36 animate-spin-slow");
    			if (!src_url_equal(img.src, img_src_value = "/assets/stamp.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Stamp");
    			add_location(img, file$6, 40, 6, 1062);
    			attr_dev(div4, "class", " flex justify-end m-12 md:mt-28");
    			add_location(div4, file$6, 39, 4, 1009);
    			attr_dev(div5, "class", " flex flex-col md:flex-row md:justify-between ");
    			add_location(div5, file$6, 23, 2, 515);
    			attr_dev(div6, "id", "menu");
    			attr_dev(div6, "class", "menu svelte-1wxn5w1");
    			toggle_class(div6, "open", /*$menu*/ ctx[0]);
    			add_location(div6, file$6, 4, 0, 65);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div6, anchor);
    			append_dev(div6, div0);
    			append_dev(div0, svg);
    			append_dev(svg, path);
    			append_dev(div6, t0);
    			append_dev(div6, div5);
    			append_dev(div5, div3);
    			append_dev(div3, div1);
    			append_dev(div1, h20);
    			append_dev(div1, t2);
    			append_dev(div1, h21);
    			append_dev(div1, t4);
    			append_dev(div1, h22);
    			append_dev(div3, t6);
    			append_dev(div3, div2);
    			append_dev(div2, h30);
    			append_dev(div2, t8);
    			append_dev(div2, h31);
    			append_dev(div2, t10);
    			append_dev(div2, h32);
    			append_dev(div5, t12);
    			append_dev(div5, div4);
    			append_dev(div4, img);

    			if (!mounted) {
    				dispose = listen_dev(div0, "click", menu.toggle, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$menu*/ 1) {
    				toggle_class(div6, "open", /*$menu*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div6);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let $menu;
    	validate_store(menu, 'menu');
    	component_subscribe($$self, menu, $$value => $$invalidate(0, $menu = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Menu', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Menu> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ menu, $menu });
    	return [$menu];
    }

    class Menu extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Menu",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src\pages\Home.svelte generated by Svelte v3.42.1 */
    const file$5 = "src\\pages\\Home.svelte";

    function create_fragment$5(ctx) {
    	let header;
    	let div0;
    	let h10;
    	let t0;
    	let br;
    	let t1;
    	let t2;
    	let div13;
    	let div4;
    	let div1;
    	let img0;
    	let img0_src_value;
    	let t3;
    	let h20;
    	let t5;
    	let h21;
    	let t7;
    	let div2;
    	let img1;
    	let img1_src_value;
    	let t8;
    	let h22;
    	let t10;
    	let h23;
    	let t12;
    	let div3;
    	let img2;
    	let img2_src_value;
    	let t13;
    	let h24;
    	let t15;
    	let h25;
    	let t17;
    	let div6;
    	let div5;
    	let t19;
    	let div9;
    	let div8;
    	let h11;
    	let t21;
    	let p;
    	let t23;
    	let div7;
    	let h26;
    	let t25;
    	let svg0;
    	let path0;
    	let t26;
    	let img3;
    	let img3_src_value;
    	let t27;
    	let div12;
    	let img4;
    	let img4_src_value;
    	let t28;
    	let div11;
    	let h12;
    	let t30;
    	let div10;
    	let h27;
    	let t32;
    	let svg1;
    	let path1;

    	const block = {
    		c: function create() {
    			header = element("header");
    			div0 = element("div");
    			h10 = element("h1");
    			t0 = text("UI/UX & ");
    			br = element("br");
    			t1 = text(" Branding");
    			t2 = space();
    			div13 = element("div");
    			div4 = element("div");
    			div1 = element("div");
    			img0 = element("img");
    			t3 = space();
    			h20 = element("h2");
    			h20.textContent = "Pocky Pop";
    			t5 = space();
    			h21 = element("h2");
    			h21.textContent = "Branding";
    			t7 = space();
    			div2 = element("div");
    			img1 = element("img");
    			t8 = space();
    			h22 = element("h2");
    			h22.textContent = "House Marketplace";
    			t10 = space();
    			h23 = element("h2");
    			h23.textContent = "UI/UX Design";
    			t12 = space();
    			div3 = element("div");
    			img2 = element("img");
    			t13 = space();
    			h24 = element("h2");
    			h24.textContent = "Pouf Co Website";
    			t15 = space();
    			h25 = element("h2");
    			h25.textContent = "UI Design, Web Design";
    			t17 = space();
    			div6 = element("div");
    			div5 = element("div");
    			div5.textContent = "More";
    			t19 = space();
    			div9 = element("div");
    			div8 = element("div");
    			h11 = element("h1");
    			h11.textContent = "Why Prota?";
    			t21 = space();
    			p = element("p");
    			p.textContent = "I’m a creative soul, specialized in Branding and UI/UX design. I always\r\n        focus on the user experience first.";
    			t23 = space();
    			div7 = element("div");
    			h26 = element("h2");
    			h26.textContent = "Get to know me more";
    			t25 = space();
    			svg0 = svg_element("svg");
    			path0 = svg_element("path");
    			t26 = space();
    			img3 = element("img");
    			t27 = space();
    			div12 = element("div");
    			img4 = element("img");
    			t28 = space();
    			div11 = element("div");
    			h12 = element("h1");
    			h12.textContent = "Tell me about your project";
    			t30 = space();
    			div10 = element("div");
    			h27 = element("h2");
    			h27.textContent = "If you want to ;)";
    			t32 = space();
    			svg1 = svg_element("svg");
    			path1 = svg_element("path");
    			add_location(br, file$5, 9, 16, 230);
    			add_location(h10, file$5, 9, 4, 218);
    			attr_dev(div0, "class", " flex flex-col text-5xl md:text-6xl lg:text-7xl ml-8 my-20 font-serif font-semibold text-red-400");
    			add_location(div0, file$5, 6, 2, 93);
    			add_location(header, file$5, 5, 0, 81);
    			attr_dev(img0, "class", "object-cover h-96 md:h-64 lg:h-80 m-8");
    			if (!src_url_equal(img0.src, img0_src_value = "/assets/img1.png")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "Pocky Pop");
    			add_location(img0, file$5, 19, 6, 487);
    			attr_dev(h20, "class", "font-bold ");
    			add_location(h20, file$5, 24, 6, 621);
    			add_location(h21, file$5, 25, 6, 666);
    			attr_dev(div1, "class", " flex flex-col text-center font-serif text-lg mt-8 lg:text-xl lg:w-2/5");
    			add_location(div1, file$5, 16, 4, 382);
    			attr_dev(img1, "class", "object-cover h-96 md:h-64 lg:h-80 m-8");
    			if (!src_url_equal(img1.src, img1_src_value = "/assets/img2.png")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "House Marketplace");
    			add_location(img1, file$5, 32, 6, 842);
    			attr_dev(h22, "class", "font-bold ");
    			add_location(h22, file$5, 37, 6, 984);
    			add_location(h23, file$5, 38, 6, 1037);
    			attr_dev(div2, "class", " flex flex-col text-center font-serif text-lg mt-8 lg:text-xl lg:w-2/5");
    			add_location(div2, file$5, 29, 4, 737);
    			attr_dev(img2, "class", "object-cover h-96 md:h-64 lg:h-80 m-8");
    			if (!src_url_equal(img2.src, img2_src_value = "/assets/img5.png")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "alt", "Pouf Co Website");
    			add_location(img2, file$5, 45, 6, 1216);
    			attr_dev(h24, "class", "font-bold ");
    			add_location(h24, file$5, 50, 6, 1356);
    			add_location(h25, file$5, 51, 6, 1407);
    			attr_dev(div3, "class", " flex flex-col text-center font-serif text-lg mt-8 lg:text-xl lg:w-2/5");
    			add_location(div3, file$5, 42, 4, 1111);
    			attr_dev(div4, "class", " md:flex md:flex-row md:justify-between");
    			add_location(div4, file$5, 14, 2, 284);
    			attr_dev(div5, "class", " flex flex-col text-center rounded-full h-32 w-32 justify-center border-red-400 border-2 font-serif font-bold m-8");
    			add_location(div5, file$5, 56, 4, 1538);
    			attr_dev(div6, "class", "flex justify-center mt-4");
    			add_location(div6, file$5, 55, 2, 1494);
    			attr_dev(h11, "class", " text-5xl lg:text-6xl font-semibold text-gray-900");
    			add_location(h11, file$5, 68, 6, 1905);
    			attr_dev(p, "class", " text-lg lg:text-xl my-2");
    			add_location(p, file$5, 71, 6, 2008);
    			attr_dev(h26, "class", " text-2xl lg:text-3xl font-semibold text-red-400");
    			add_location(h26, file$5, 76, 8, 2219);
    			attr_dev(path0, "d", "M18.17 13L15.59 15.59L17 17L22 12L17 7L15.59 8.41L18.17 11H2V13H18.17Z");
    			add_location(path0, file$5, 85, 10, 2522);
    			attr_dev(svg0, "class", "fill-current text-red-400 h-8 w-6 ml-1 ");
    			attr_dev(svg0, "viewBox", "0 0 24 24");
    			attr_dev(svg0, "fill", "none");
    			attr_dev(svg0, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg0, file$5, 79, 8, 2336);
    			attr_dev(div7, "class", " flex");
    			add_location(div7, file$5, 75, 6, 2190);
    			attr_dev(div8, "class", " md:w-1/2 lg:w-2/5");
    			add_location(div8, file$5, 67, 4, 1865);
    			attr_dev(img3, "class", " object-cover h-40 my-4 lg:h-60 lg:w-2/3");
    			if (!src_url_equal(img3.src, img3_src_value = "/assets/img3.png")) attr_dev(img3, "src", img3_src_value);
    			attr_dev(img3, "alt", "Me");
    			add_location(img3, file$5, 91, 4, 2677);
    			attr_dev(div9, "class", "flex flex-col md:flex-row md:justify-between md:items-center lg:gap-x-16 mx-8 my-8 font-serif");
    			add_location(div9, file$5, 64, 2, 1743);
    			attr_dev(img4, "class", " object-cover h-40 my-4 lg:h-60 lg:w-2/3");
    			if (!src_url_equal(img4.src, img4_src_value = "/assets/img4.png")) attr_dev(img4, "src", img4_src_value);
    			attr_dev(img4, "alt", "Contact Me");
    			add_location(img4, file$5, 102, 4, 2962);
    			attr_dev(h12, "class", " text-4xl lg:text-5xl font-semibold text-gray-900 ");
    			add_location(h12, file$5, 108, 6, 3130);
    			attr_dev(h27, "class", " text-2xl lg:text-3xl font-semibold text-red-400");
    			add_location(h27, file$5, 112, 8, 3284);
    			attr_dev(path1, "d", "M18.17 13L15.59 15.59L17 17L22 12L17 7L15.59 8.41L18.17 11H2V13H18.17Z");
    			add_location(path1, file$5, 121, 10, 3585);
    			attr_dev(svg1, "class", "fill-current text-red-400 h-8 w-6 ml-1 ");
    			attr_dev(svg1, "viewBox", "0 0 24 24");
    			attr_dev(svg1, "fill", "none");
    			attr_dev(svg1, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg1, file$5, 115, 8, 3399);
    			attr_dev(div10, "class", " flex my-2");
    			add_location(div10, file$5, 111, 6, 3250);
    			attr_dev(div11, "class", " md:w-1/2 lg:w-2/5");
    			add_location(div11, file$5, 107, 4, 3090);
    			attr_dev(div12, "class", "flex flex-col md:flex-row md:justify-between md:items-center lg:gap-x-16 mx-8 mt-8 mb-12 font-serif");
    			add_location(div12, file$5, 99, 2, 2834);
    			add_location(div13, file$5, 13, 0, 275);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);
    			append_dev(header, div0);
    			append_dev(div0, h10);
    			append_dev(h10, t0);
    			append_dev(h10, br);
    			append_dev(h10, t1);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div13, anchor);
    			append_dev(div13, div4);
    			append_dev(div4, div1);
    			append_dev(div1, img0);
    			append_dev(div1, t3);
    			append_dev(div1, h20);
    			append_dev(div1, t5);
    			append_dev(div1, h21);
    			append_dev(div4, t7);
    			append_dev(div4, div2);
    			append_dev(div2, img1);
    			append_dev(div2, t8);
    			append_dev(div2, h22);
    			append_dev(div2, t10);
    			append_dev(div2, h23);
    			append_dev(div4, t12);
    			append_dev(div4, div3);
    			append_dev(div3, img2);
    			append_dev(div3, t13);
    			append_dev(div3, h24);
    			append_dev(div3, t15);
    			append_dev(div3, h25);
    			append_dev(div13, t17);
    			append_dev(div13, div6);
    			append_dev(div6, div5);
    			append_dev(div13, t19);
    			append_dev(div13, div9);
    			append_dev(div9, div8);
    			append_dev(div8, h11);
    			append_dev(div8, t21);
    			append_dev(div8, p);
    			append_dev(div8, t23);
    			append_dev(div8, div7);
    			append_dev(div7, h26);
    			append_dev(div7, t25);
    			append_dev(div7, svg0);
    			append_dev(svg0, path0);
    			append_dev(div9, t26);
    			append_dev(div9, img3);
    			append_dev(div13, t27);
    			append_dev(div13, div12);
    			append_dev(div12, img4);
    			append_dev(div12, t28);
    			append_dev(div12, div11);
    			append_dev(div11, h12);
    			append_dev(div11, t30);
    			append_dev(div11, div10);
    			append_dev(div10, h27);
    			append_dev(div10, t32);
    			append_dev(div10, svg1);
    			append_dev(svg1, path1);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div13);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Home', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Home> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ menu });
    	return [];
    }

    class Home extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Home",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src\components\Footer.svelte generated by Svelte v3.42.1 */
    const file$4 = "src\\components\\Footer.svelte";

    function create_fragment$4(ctx) {
    	let footer;
    	let img0;
    	let img0_src_value;
    	let t0;
    	let img1;
    	let img1_src_value;
    	let t1;
    	let div2;
    	let div0;
    	let h20;
    	let t3;
    	let h21;
    	let t5;
    	let h22;
    	let t7;
    	let h23;
    	let t9;
    	let div1;
    	let h24;
    	let t11;
    	let h25;
    	let t13;
    	let h26;
    	let t15;
    	let h27;

    	const block = {
    		c: function create() {
    			footer = element("footer");
    			img0 = element("img");
    			t0 = space();
    			img1 = element("img");
    			t1 = space();
    			div2 = element("div");
    			div0 = element("div");
    			h20 = element("h2");
    			h20.textContent = "Work";
    			t3 = space();
    			h21 = element("h2");
    			h21.textContent = "Branding";
    			t5 = space();
    			h22 = element("h2");
    			h22.textContent = "UI/UX";
    			t7 = space();
    			h23 = element("h2");
    			h23.textContent = "About Me";
    			t9 = space();
    			div1 = element("div");
    			h24 = element("h2");
    			h24.textContent = "Behance";
    			t11 = space();
    			h25 = element("h2");
    			h25.textContent = "LinkedIn";
    			t13 = space();
    			h26 = element("h2");
    			h26.textContent = "Polywork";
    			t15 = space();
    			h27 = element("h2");
    			h27.textContent = "Contact Me";
    			attr_dev(img0, "class", " object-contain h-16 md:h-20");
    			if (!src_url_equal(img0.src, img0_src_value = "/assets/logofooter.svg")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "Logo");
    			add_location(img0, file$4, 7, 2, 215);
    			attr_dev(img1, "class", " object-contain h-14 md:h-16 animate-spin-slow");
    			if (!src_url_equal(img1.src, img1_src_value = "/assets/stamp2.svg")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "Stamp");
    			add_location(img1, file$4, 13, 2, 323);
    			add_location(h20, file$4, 21, 6, 525);
    			add_location(h21, file$4, 22, 6, 546);
    			add_location(h22, file$4, 23, 6, 571);
    			add_location(h23, file$4, 24, 6, 593);
    			add_location(div0, file$4, 20, 4, 512);
    			add_location(h24, file$4, 27, 6, 656);
    			add_location(h25, file$4, 28, 6, 680);
    			add_location(h26, file$4, 29, 6, 705);
    			attr_dev(h27, "class", " text-red-400");
    			add_location(h27, file$4, 30, 6, 730);
    			attr_dev(div1, "class", " ml-16");
    			add_location(div1, file$4, 26, 4, 628);
    			attr_dev(div2, "class", " flex flex-row font-serif text-lg mt-8 md:mt-0");
    			add_location(div2, file$4, 19, 2, 446);
    			attr_dev(footer, "class", "border-t-2 border-gray-500 m-8 lg:m-16 py-8 lg:py-12 bottom-0 p-1 flex flex-wrap lg:flex-row justify-between md:items-center");
    			add_location(footer, file$4, 4, 0, 65);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, footer, anchor);
    			append_dev(footer, img0);
    			append_dev(footer, t0);
    			append_dev(footer, img1);
    			append_dev(footer, t1);
    			append_dev(footer, div2);
    			append_dev(div2, div0);
    			append_dev(div0, h20);
    			append_dev(div0, t3);
    			append_dev(div0, h21);
    			append_dev(div0, t5);
    			append_dev(div0, h22);
    			append_dev(div0, t7);
    			append_dev(div0, h23);
    			append_dev(div2, t9);
    			append_dev(div2, div1);
    			append_dev(div1, h24);
    			append_dev(div1, t11);
    			append_dev(div1, h25);
    			append_dev(div1, t13);
    			append_dev(div1, h26);
    			append_dev(div1, t15);
    			append_dev(div1, h27);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(footer);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Footer', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Footer> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ menu });
    	return [];
    }

    class Footer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Footer",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src\pages\Work.svelte generated by Svelte v3.42.1 */
    const file$3 = "src\\pages\\Work.svelte";

    function create_fragment$3(ctx) {
    	let header;
    	let div1;
    	let h1;
    	let t1;
    	let div0;
    	let h20;
    	let t3;
    	let h21;
    	let t5;
    	let h22;
    	let t7;
    	let div7;
    	let div2;
    	let img0;
    	let img0_src_value;
    	let t8;
    	let h23;
    	let t10;
    	let h24;
    	let t12;
    	let div3;
    	let img1;
    	let img1_src_value;
    	let t13;
    	let h25;
    	let t15;
    	let h26;
    	let t17;
    	let div4;
    	let img2;
    	let img2_src_value;
    	let t18;
    	let h27;
    	let t20;
    	let h28;
    	let t22;
    	let div5;
    	let img3;
    	let img3_src_value;
    	let t23;
    	let h29;
    	let t25;
    	let h210;
    	let t27;
    	let div6;
    	let img4;
    	let img4_src_value;
    	let t28;
    	let h211;
    	let t30;
    	let h212;

    	const block = {
    		c: function create() {
    			header = element("header");
    			div1 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Work";
    			t1 = space();
    			div0 = element("div");
    			h20 = element("h2");
    			h20.textContent = "All";
    			t3 = space();
    			h21 = element("h2");
    			h21.textContent = "UI/UX";
    			t5 = space();
    			h22 = element("h2");
    			h22.textContent = "Branding";
    			t7 = space();
    			div7 = element("div");
    			div2 = element("div");
    			img0 = element("img");
    			t8 = space();
    			h23 = element("h2");
    			h23.textContent = "Pocky Pop";
    			t10 = space();
    			h24 = element("h2");
    			h24.textContent = "Branding";
    			t12 = space();
    			div3 = element("div");
    			img1 = element("img");
    			t13 = space();
    			h25 = element("h2");
    			h25.textContent = "House Marketplace App";
    			t15 = space();
    			h26 = element("h2");
    			h26.textContent = "UI/UX Design";
    			t17 = space();
    			div4 = element("div");
    			img2 = element("img");
    			t18 = space();
    			h27 = element("h2");
    			h27.textContent = "Pouf Co Website";
    			t20 = space();
    			h28 = element("h2");
    			h28.textContent = "UI Design, Web Design";
    			t22 = space();
    			div5 = element("div");
    			img3 = element("img");
    			t23 = space();
    			h29 = element("h2");
    			h29.textContent = "Meat Packing by Silvestre";
    			t25 = space();
    			h210 = element("h2");
    			h210.textContent = "Branding";
    			t27 = space();
    			div6 = element("div");
    			img4 = element("img");
    			t28 = space();
    			h211 = element("h2");
    			h211.textContent = "Doña Wendy Bocadillos";
    			t30 = space();
    			h212 = element("h2");
    			h212.textContent = "Branding";
    			attr_dev(h1, "class", " text-5xl md:text-6xl lg:text-7xl font-semibold text-red-400");
    			add_location(h1, file$3, 7, 4, 162);
    			attr_dev(h20, "class", " text-red-400");
    			add_location(h20, file$3, 11, 6, 314);
    			attr_dev(h21, "class", " ml-4");
    			add_location(h21, file$3, 12, 6, 356);
    			attr_dev(h22, "class", " ml-4");
    			add_location(h22, file$3, 13, 6, 392);
    			attr_dev(div0, "class", " flex flex-row text-2xl mt-4");
    			add_location(div0, file$3, 10, 4, 264);
    			attr_dev(div1, "class", " flex flex-col  ml-8 my-20 font-serif");
    			add_location(div1, file$3, 6, 2, 105);
    			add_location(header, file$3, 5, 0, 93);
    			attr_dev(img0, "class", "object-cover h-96 md:h-64 lg:h-80 m-8");
    			if (!src_url_equal(img0.src, img0_src_value = "/assets/img1.png")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "Pocky Pop");
    			add_location(img0, file$3, 21, 4, 639);
    			attr_dev(h23, "class", "font-bold ");
    			add_location(h23, file$3, 26, 4, 763);
    			add_location(h24, file$3, 27, 4, 806);
    			attr_dev(div2, "class", " flex flex-col text-center font-serif text-lg lg:text-xl mt-8");
    			add_location(div2, file$3, 20, 2, 558);
    			attr_dev(img1, "class", "object-cover h-96 md:h-64 lg:h-80 m-8");
    			if (!src_url_equal(img1.src, img1_src_value = "/assets/img2.png")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "House Marketplace");
    			add_location(img1, file$3, 32, 4, 958);
    			attr_dev(h25, "class", "font-bold ");
    			add_location(h25, file$3, 37, 4, 1090);
    			add_location(h26, file$3, 38, 4, 1145);
    			attr_dev(div3, "class", " flex flex-col text-center font-serif text-lg lg:text-xl mt-8");
    			add_location(div3, file$3, 31, 2, 877);
    			attr_dev(img2, "class", "object-cover h-96 md:h-64 lg:h-80 m-8");
    			if (!src_url_equal(img2.src, img2_src_value = "/assets/img5.png")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "alt", "Pouf Co Website");
    			add_location(img2, file$3, 43, 4, 1298);
    			attr_dev(h27, "class", "font-bold ");
    			add_location(h27, file$3, 48, 4, 1428);
    			add_location(h28, file$3, 49, 4, 1477);
    			attr_dev(div4, "class", " flex flex-col text-center font-serif text-lg lg:text-xl mt-8");
    			add_location(div4, file$3, 42, 2, 1217);
    			attr_dev(img3, "class", "object-cover h-96 md:h-64 lg:h-80 m-8");
    			if (!src_url_equal(img3.src, img3_src_value = "/assets/img6.png")) attr_dev(img3, "src", img3_src_value);
    			attr_dev(img3, "alt", "Pouf Co Website");
    			add_location(img3, file$3, 54, 4, 1642);
    			attr_dev(h29, "class", "font-bold ");
    			add_location(h29, file$3, 59, 4, 1772);
    			add_location(h210, file$3, 60, 4, 1831);
    			attr_dev(div5, "class", " flex flex-col text-center font-serif text-lg lg:text-xl mt-8");
    			add_location(div5, file$3, 53, 2, 1561);
    			attr_dev(img4, "class", "object-cover h-96 md:h-64 lg:h-80 m-8");
    			if (!src_url_equal(img4.src, img4_src_value = "/assets/img7.png")) attr_dev(img4, "src", img4_src_value);
    			attr_dev(img4, "alt", "Pouf Co Website");
    			add_location(img4, file$3, 67, 4, 1993);
    			attr_dev(h211, "class", "font-bold ");
    			add_location(h211, file$3, 72, 4, 2123);
    			add_location(h212, file$3, 73, 4, 2178);
    			attr_dev(div6, "class", " flex flex-col text-center font-serif text-lg mt-8 lg:text-xl mb-12");
    			add_location(div6, file$3, 64, 2, 1897);
    			attr_dev(div7, "class", " md:grid md:grid-cols-3 md:justify-between ");
    			add_location(div7, file$3, 18, 0, 460);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);
    			append_dev(header, div1);
    			append_dev(div1, h1);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			append_dev(div0, h20);
    			append_dev(div0, t3);
    			append_dev(div0, h21);
    			append_dev(div0, t5);
    			append_dev(div0, h22);
    			insert_dev(target, t7, anchor);
    			insert_dev(target, div7, anchor);
    			append_dev(div7, div2);
    			append_dev(div2, img0);
    			append_dev(div2, t8);
    			append_dev(div2, h23);
    			append_dev(div2, t10);
    			append_dev(div2, h24);
    			append_dev(div7, t12);
    			append_dev(div7, div3);
    			append_dev(div3, img1);
    			append_dev(div3, t13);
    			append_dev(div3, h25);
    			append_dev(div3, t15);
    			append_dev(div3, h26);
    			append_dev(div7, t17);
    			append_dev(div7, div4);
    			append_dev(div4, img2);
    			append_dev(div4, t18);
    			append_dev(div4, h27);
    			append_dev(div4, t20);
    			append_dev(div4, h28);
    			append_dev(div7, t22);
    			append_dev(div7, div5);
    			append_dev(div5, img3);
    			append_dev(div5, t23);
    			append_dev(div5, h29);
    			append_dev(div5, t25);
    			append_dev(div5, h210);
    			append_dev(div7, t27);
    			append_dev(div7, div6);
    			append_dev(div6, img4);
    			append_dev(div6, t28);
    			append_dev(div6, h211);
    			append_dev(div6, t30);
    			append_dev(div6, h212);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);
    			if (detaching) detach_dev(t7);
    			if (detaching) detach_dev(div7);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Work', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Work> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ menu });
    	return [];
    }

    class Work extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Work",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src\pages\About.svelte generated by Svelte v3.42.1 */
    const file$2 = "src\\pages\\About.svelte";

    function create_fragment$2(ctx) {
    	let header;
    	let div0;
    	let h10;
    	let t1;
    	let p0;
    	let t3;
    	let div6;
    	let img;
    	let img_src_value;
    	let t4;
    	let div5;
    	let div2;
    	let div1;
    	let h11;
    	let t6;
    	let p1;
    	let t8;
    	let div4;
    	let h12;
    	let t10;
    	let div3;
    	let h2;
    	let t12;
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			header = element("header");
    			div0 = element("div");
    			h10 = element("h1");
    			h10.textContent = "Why Prota?";
    			t1 = space();
    			p0 = element("p");
    			p0.textContent = "I’m a creative soul, specialized in Branding and UI/UX design. I always\r\n      focus on the user experience first.";
    			t3 = space();
    			div6 = element("div");
    			img = element("img");
    			t4 = space();
    			div5 = element("div");
    			div2 = element("div");
    			div1 = element("div");
    			h11 = element("h1");
    			h11.textContent = "What can i help you with?";
    			t6 = space();
    			p1 = element("p");
    			p1.textContent = "If you need help with the design of an app or a website, or if you\r\n          need a visual identity for your business, i will use my knoledge in\r\n          these areas to help you connect with your target audience through my\r\n          process.";
    			t8 = space();
    			div4 = element("div");
    			h12 = element("h1");
    			h12.textContent = "Tell me about your project";
    			t10 = space();
    			div3 = element("div");
    			h2 = element("h2");
    			h2.textContent = "If you are interested :)";
    			t12 = space();
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(h10, "class", " text-5xl md:text-6xl lg:text-7xl font-semibold text-red-400");
    			add_location(h10, file$2, 7, 4, 150);
    			attr_dev(p0, "class", " text-lg lg:text-xl my-2 ");
    			add_location(p0, file$2, 10, 4, 258);
    			attr_dev(div0, "class", " flex flex-col  mx-8 mt-20 font-serif");
    			add_location(div0, file$2, 6, 2, 93);
    			add_location(header, file$2, 5, 0, 81);
    			attr_dev(img, "class", " object-cover h-80 mx-8 my-2");
    			if (!src_url_equal(img.src, img_src_value = "/assets/img8.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Me");
    			add_location(img, file$2, 18, 2, 534);
    			attr_dev(h11, "class", " text-3xl font-semibold text-gray-900");
    			add_location(h11, file$2, 26, 8, 818);
    			attr_dev(p1, "class", " text-lg my-2 ");
    			add_location(p1, file$2, 29, 8, 930);
    			add_location(div1, file$2, 25, 6, 803);
    			attr_dev(div2, "class", " flex flex-col md:flex-row md:justify-start md:items-center lg:gap-x-16 mx-8 my-8 font-serif");
    			add_location(div2, file$2, 22, 4, 676);
    			attr_dev(h12, "class", " text-3xl font-semibold text-gray-900");
    			add_location(h12, file$2, 40, 6, 1346);
    			attr_dev(h2, "class", " text-xl font-semibold text-red-400");
    			add_location(h2, file$2, 44, 8, 1487);
    			attr_dev(path, "d", "M18.17 13L15.59 15.59L17 17L22 12L17 7L15.59 8.41L18.17 11H2V13H18.17Z");
    			add_location(path, file$2, 53, 10, 1782);
    			attr_dev(svg, "class", "fill-current text-red-400 h-8 w-6 ml-1 ");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg, file$2, 47, 8, 1596);
    			attr_dev(div3, "class", " flex my-2");
    			add_location(div3, file$2, 43, 6, 1453);
    			attr_dev(div4, "class", " flex flex-col  mx-8 my-8 font-serif");
    			add_location(div4, file$2, 39, 4, 1288);
    			attr_dev(div5, "class", " md:col-span-2");
    			add_location(div5, file$2, 20, 2, 616);
    			attr_dev(div6, "class", " flex flex-col md:grid md:grid-cols-3 md:mt-8 md:gap-8 lg:gap-0 ");
    			add_location(div6, file$2, 17, 0, 452);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);
    			append_dev(header, div0);
    			append_dev(div0, h10);
    			append_dev(div0, t1);
    			append_dev(div0, p0);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, div6, anchor);
    			append_dev(div6, img);
    			append_dev(div6, t4);
    			append_dev(div6, div5);
    			append_dev(div5, div2);
    			append_dev(div2, div1);
    			append_dev(div1, h11);
    			append_dev(div1, t6);
    			append_dev(div1, p1);
    			append_dev(div5, t8);
    			append_dev(div5, div4);
    			append_dev(div4, h12);
    			append_dev(div4, t10);
    			append_dev(div4, div3);
    			append_dev(div3, h2);
    			append_dev(div3, t12);
    			append_dev(div3, svg);
    			append_dev(svg, path);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(div6);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('About', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<About> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ menu });
    	return [];
    }

    class About extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "About",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src\pages\Contact.svelte generated by Svelte v3.42.1 */
    const file$1 = "src\\pages\\Contact.svelte";

    function create_fragment$1(ctx) {
    	let header;
    	let div1;
    	let h1;
    	let t1;
    	let p;
    	let t3;
    	let div0;
    	let h2;
    	let t5;
    	let svg;
    	let path;
    	let t6;
    	let div3;
    	let div2;
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			header = element("header");
    			div1 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Hit me up";
    			t1 = space();
    			p = element("p");
    			p.textContent = "You can send me an email explaining your project and then i can set up a\r\n      meeting to discuss a proposal.";
    			t3 = space();
    			div0 = element("div");
    			h2 = element("h2");
    			h2.textContent = "Jahazrodriguez@gmail.com";
    			t5 = space();
    			svg = svg_element("svg");
    			path = svg_element("path");
    			t6 = space();
    			div3 = element("div");
    			div2 = element("div");
    			img = element("img");
    			attr_dev(h1, "class", " text-5xl md:text-6xl lg:text-7xl font-semibold text-red-400");
    			add_location(h1, file$1, 7, 4, 155);
    			attr_dev(p, "class", " text-lg my-2 ");
    			add_location(p, file$1, 10, 4, 262);
    			attr_dev(h2, "class", " text-xl font-semibold text-red-400");
    			add_location(h2, file$1, 15, 6, 454);
    			attr_dev(path, "d", "M17.001 20H6.00098C4.89641 20 4.00098 19.1046 4.00098 18V7C4.00098 5.89543 4.89641 5 6.00098 5H10.001V7H6.00098V18H17.001V14H19.001V18C19.001 19.1046 18.1055 20 17.001 20ZM11.701 13.707L10.291 12.293L16.584 6H13.001V4H20.001V11H18.001V7.415L11.701 13.707Z");
    			add_location(path, file$1, 24, 8, 731);
    			attr_dev(svg, "class", "fill-current text-red-400 h-8 w-6 ml-1 ");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg, file$1, 18, 6, 557);
    			attr_dev(div0, "class", " flex my-2");
    			add_location(div0, file$1, 14, 4, 422);
    			attr_dev(div1, "class", " flex flex-col  mx-8 mt-20 mb-8 font-serif");
    			add_location(div1, file$1, 6, 2, 93);
    			add_location(header, file$1, 5, 0, 81);
    			attr_dev(img, "class", " object-contain h-36 w-36 animate-spin-slow");
    			if (!src_url_equal(img.src, img_src_value = "/assets/stamp2.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Stamp");
    			add_location(img, file$1, 37, 4, 1220);
    			attr_dev(div2, "class", " flex flex-col text-center rounded-full h-32 w-32 justify-center m-8");
    			add_location(div2, file$1, 34, 2, 1123);
    			attr_dev(div3, "class", "flex justify-center");
    			add_location(div3, file$1, 33, 0, 1086);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);
    			append_dev(header, div1);
    			append_dev(div1, h1);
    			append_dev(div1, t1);
    			append_dev(div1, p);
    			append_dev(div1, t3);
    			append_dev(div1, div0);
    			append_dev(div0, h2);
    			append_dev(div0, t5);
    			append_dev(div0, svg);
    			append_dev(svg, path);
    			insert_dev(target, t6, anchor);
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div2);
    			append_dev(div2, img);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);
    			if (detaching) detach_dev(t6);
    			if (detaching) detach_dev(div3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Contact', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Contact> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ menu });
    	return [];
    }

    class Contact extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Contact",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\App.svelte generated by Svelte v3.42.1 */
    const file = "src\\App.svelte";

    function create_fragment(ctx) {
    	let menu;
    	let t0;
    	let main;
    	let header;
    	let t1;
    	let home;
    	let t2;
    	let footer;
    	let current;
    	menu = new Menu({ $$inline: true });
    	header = new Header({ $$inline: true });
    	home = new Home({ $$inline: true });
    	footer = new Footer({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(menu.$$.fragment);
    			t0 = space();
    			main = element("main");
    			create_component(header.$$.fragment);
    			t1 = space();
    			create_component(home.$$.fragment);
    			t2 = space();
    			create_component(footer.$$.fragment);
    			add_location(main, file, 12, 0, 367);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(menu, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, main, anchor);
    			mount_component(header, main, null);
    			append_dev(main, t1);
    			mount_component(home, main, null);
    			append_dev(main, t2);
    			mount_component(footer, main, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(menu.$$.fragment, local);
    			transition_in(header.$$.fragment, local);
    			transition_in(home.$$.fragment, local);
    			transition_in(footer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(menu.$$.fragment, local);
    			transition_out(header.$$.fragment, local);
    			transition_out(home.$$.fragment, local);
    			transition_out(footer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(menu, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(main);
    			destroy_component(header);
    			destroy_component(home);
    			destroy_component(footer);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Header,
    		Menu,
    		Home,
    		Footer,
    		Work,
    		About,
    		Contact
    	});

    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		name: 'world'
    	}
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
