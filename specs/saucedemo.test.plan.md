# SauceDemo Test Plan

## Application Overview

Comprehensive test plan for Sauce Demo covering authentication, product browsing, cart management, checkout, and session/logout behavior. Tests are independent, start from a blank state, and include both happy paths and negative validation scenarios. User personas and credentials are provided via environment variables.

## Quick Stability Checklist

Use this checklist when creating or refactoring specs.

1. Reuse shared constants from `tests/helpers/test-data.ts` instead of hardcoded product/user literals.
2. Assert page checkpoints after major transitions (URL + visible heading/title).
3. Prefer resilient selectors (role/text first, stable structural fallback if `data-test` is missing).
4. Avoid fragile selectors tied to incidental DOM structure or generated ids.
5. Validate cart and checkout state with minimal, behavior-focused assertions.
6. For persona defects, assert deterministic known-broken behavior, not forced happy paths.
7. After sidebar actions (for example Reset App State), close menu and verify on the main page surface.
8. Use `page.reload()` when needed for deterministic post-reset state propagation.
9. Never use fixed sleeps; rely on Playwright auto-waiting and semantic expectations.
10. Keep tests isolated and independent unless a fixture explicitly scopes shared setup.

## Test Scenarios

### 1. Authentication

**Seed:** `seed.spec.ts`

#### 1.1. Login succeeds for configured standard account

**File:** `tests/auth/login-standard-user.spec.ts`

**Steps:**
  1. Open the configured base URL from a fresh browser context.
    - expect: Login page is visible with username, password, and Login button.
  2. Enter configured standard username and password, then click Login.
    - expect: User is redirected to /inventory.html.
    - expect: Products header is visible.
    - expect: No login error message is shown.

#### 1.2. Login fails for configured locked account

**File:** `tests/auth/login-locked-out-user.spec.ts`

**Steps:**
  1. Open the configured base URL from a fresh browser context.
    - expect: Login page is visible.
  2. Enter configured locked username and password, then click Login.
    - expect: User remains on login page.
    - expect: Error message shows locked-out text: Epic sadface: Sorry, this user has been locked out.

#### 1.3. Login fails with invalid password

**File:** `tests/auth/login-invalid-password.spec.ts`

**Steps:**
  1. Open the configured base URL from a fresh browser context.
    - expect: Login page is visible.
  2. Enter configured standard username and configured invalid password, then click Login.
    - expect: User remains on login page.
    - expect: Error message indicates username/password mismatch.

#### 1.4. Login validation requires username and password

**File:** `tests/auth/login-required-fields.spec.ts`

**Steps:**
  1. Open the configured base URL from a fresh browser context.
    - expect: Login page is visible.
  2. Click Login with both fields empty.
    - expect: Validation error appears for missing username.
  3. Enter only username and click Login.
    - expect: Validation error appears for missing password.

### 2. Inventory and Cart

**Seed:** `seed.spec.ts`

#### 2.1. Add single product to cart from inventory

**File:** `tests/cart/add-single-item.spec.ts`

**Steps:**
  1. Open login page and login with configured standard credentials.
    - expect: User lands on inventory page.
  2. Click Add to cart for Sauce Labs Backpack.
    - expect: Button changes to Remove.
    - expect: Cart badge count becomes 1.
  3. Open cart via cart icon.
    - expect: Cart page shows Sauce Labs Backpack with quantity 1 and correct price.

#### 2.2. Add multiple products and remove one in cart

**File:** `tests/cart/add-multiple-remove-one.spec.ts`

**Steps:**
  1. Open login page and login with configured standard credentials.
    - expect: Inventory page is visible.
  2. Add two different products to cart.
    - expect: Cart badge count is 2.
  3. Open cart and click Remove for one product.
    - expect: Removed product disappears from cart.
    - expect: Remaining product is still present.
    - expect: Cart badge count updates to 1.

#### 2.3. Continue Shopping navigates back to inventory

**File:** `tests/cart/continue-shopping.spec.ts`

**Steps:**
  1. Open login page, login with configured standard credentials, add at least one item, open cart.
    - expect: Cart page is visible with at least one item.
  2. Click Continue Shopping.
    - expect: User returns to inventory page.
    - expect: Previously added items remain in cart.

#### 2.4. Inventory sorting works for all options

**File:** `tests/inventory/sorting.spec.ts`

**Steps:**
  1. Open login page and login with configured standard credentials.
    - expect: Inventory page is visible with sort dropdown defaulting to Name (A to Z).
  2. Select Name (Z to A).
    - expect: Product order changes to descending by name.
  3. Select Price (low to high).
    - expect: Product order changes to ascending by price.
  4. Select Price (high to low).
    - expect: Product order changes to descending by price.

#### 2.5. Product detail navigation and back to list

**File:** `tests/inventory/product-detail-navigation.spec.ts`

**Steps:**
  1. Open login page and login with configured standard credentials.
    - expect: Inventory page is visible.
  2. Click a product name or image to open detail page.
    - expect: Product detail page is shown with matching product info.
  3. Use Back to products.
    - expect: User returns to inventory list view.

### 3. Checkout and Session

**Seed:** `seed.spec.ts`

#### 3.1. Checkout happy path completes order

**File:** `tests/checkout/checkout-happy-path.spec.ts`

**Steps:**
  1. Open login page and login with configured standard credentials.
    - expect: Inventory page is visible.
  2. Add one item to cart and open cart.
    - expect: Cart contains selected item.
  3. Click Checkout, fill First Name, Last Name, Zip/Postal Code, then Continue.
    - expect: Checkout overview page is displayed with item summary and totals.
  4. Click Finish.
    - expect: Checkout complete page appears with Thank you for your order message.

#### 3.2. Checkout step one requires all mandatory fields

**File:** `tests/checkout/checkout-validation-required-fields.spec.ts`

**Steps:**
  1. Open login page, login with configured standard credentials, add one item, and open checkout step one.
    - expect: Checkout your information form is visible.
  2. Click Continue with all fields empty.
    - expect: Error appears for missing First Name.
  3. Fill First Name only and click Continue.
    - expect: Error appears for missing Last Name.
  4. Fill Last Name as well and click Continue without postal code.
    - expect: Error appears for missing Postal Code.

#### 3.3. Cancel on checkout step one returns to cart

**File:** `tests/checkout/checkout-cancel-step-one.spec.ts`

**Steps:**
  1. Open login page, login with configured standard credentials, add item, open checkout step one.
    - expect: Checkout step one is visible.
  2. Click Cancel.
    - expect: User returns to cart page.
    - expect: Cart contents are unchanged.

#### 3.4. Cancel on checkout overview returns to inventory

**File:** `tests/checkout/checkout-cancel-overview.spec.ts`

**Steps:**
  1. Open login page, login with configured standard credentials, add item, proceed to checkout overview.
    - expect: Checkout overview is visible.
  2. Click Cancel on overview.
    - expect: User is redirected to inventory page.
    - expect: Cart state remains consistent.

#### 3.5. Logout from menu returns to login and blocks protected page

**File:** `tests/session/logout-and-protected-route.spec.ts`

**Steps:**
  1. Open login page and login with configured standard credentials.
    - expect: Inventory page is visible.
  2. Open menu and click Logout.
    - expect: User returns to login page.
  3. Attempt to open /inventory.html directly.
    - expect: User is redirected to login page or blocked from protected content.

#### 3.6. Reset App State clears cart badge and item state

**File:** `tests/session/reset-app-state.spec.ts`

**Steps:**
  1. Open login page and login with configured standard credentials.
    - expect: Inventory page is visible.
  2. Add two products to cart.
    - expect: Cart badge shows 2.
    - expect: Buttons for those items show Remove.
  3. Open menu and click Reset App State.
    - expect: Cart badge is cleared.
    - expect: Item buttons revert to Add to cart state.

### 4. Persona-Specific Stability Checks

**Seed:** `seed.spec.ts`

#### 4.1. Problem persona shows stable last-name validation defect on checkout step one

**File:** `tests/persona/problem-user-flow.spec.ts`

**Steps:**
  1. Open login page and login as configured problem persona.
    - expect: User reaches inventory page.
  2. Add one item, open cart, and open checkout step one.
    - expect: Checkout information form is visible.
  3. Fill checkout information and click Continue.
    - expect: User remains on checkout step one.
    - expect: Validation error indicates Last Name is required.

#### 4.2. Performance persona login and inventory load within acceptable threshold

**File:** `tests/persona/performance-glitch-user.spec.ts`

**Steps:**
  1. Open login page and measure time from clicking Login for configured performance persona to inventory visible.
    - expect: Inventory eventually loads.
    - expect: Measured duration is recorded for trend tracking and compared to agreed threshold (e.g., <= 10s in CI baseline).

#### 4.3. Error and visual persona smoke checks

**File:** `tests/persona/error-visual-user-smoke.spec.ts`

**Steps:**
  1. Run separate subchecks for configured error and visual personas in isolated fresh contexts.
    - expect: Both users can login (unless environment behavior changes).
    - expect: Core elements are present: menu, product list, cart icon.
  2. For each user, add one item and open cart.
    - expect: Cart interaction works and page does not hard-fail.

## Stabilization and Reliability Guide

Use these conventions for all new or refactored specs to reduce flakes and cross-browser drift.

### A. Shared test data first

- Centralize product names/slugs/prices and reusable checkout data in `tests/helpers/test-data.ts`.
- Reuse constants instead of repeating literals in selectors and assertions.
- Keep personas explicit in data naming to avoid accidental reuse of incompatible values.

### B. Prefer resilient selectors and assertions

- Prefer role- and text-based assertions for user-visible behavior (example: product link name in cart).
- Use stable structural selectors where `data-test` is missing on specific pages (example: `.cart_item`, `.cart_quantity`).
- Avoid brittle selectors tied to internal ids that can vary by page composition.

### C. Assert navigation checkpoints explicitly

- After critical actions (login, cart open, checkout continue), assert URL and page title/heading before next step.
- Treat checkout as a multi-step state machine and assert current step before interacting with step-only controls.

### D. Handle persona-specific defects deterministically

- For known-broken personas, assert the stable defect behavior instead of forcing a happy path.
- Keep defect assertions narrow: expected page, expected error text, and one minimal precondition flow.
- Document the rationale in the spec name and step expectations so failures remain actionable.

### E. Session/menu state operations

- After sidebar actions (for example Reset App State), close menu and re-check state on the main surface.
- If state propagation is asynchronous, prefer a deterministic page reload plus post-conditions over arbitrary waits.

### F. Anti-flake defaults

- Avoid fixed sleeps; rely on Playwright auto-waiting plus semantic expectations.
- Keep each test independent (fresh login and state) unless a fixture explicitly scopes shared setup.
- Use minimal but precise assertions: enough to prove behavior without overconstraining dynamic UI details.
