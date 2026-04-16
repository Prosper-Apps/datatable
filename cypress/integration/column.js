describe('Column', function () {
    beforeEach(function () {
        cy.visit('/');
    });

    it('header dropdown toggles on click', function () {
        cy.getColumnCell(2)
            .find('.dt-dropdown__toggle')
            .as('toggle')
            .click();
        cy.get('.dt-dropdown__list')
            .as('dropdown-list')
            .should('be.visible');

        cy.getColumnCell(2).click();

        cy.get('@dropdown-list').should('not.be.visible');
    });

    it('sort ascending button should work', function () {
        cy.clickDropdown(2);
        cy.clickDropdownItem(2, 'Sort Ascending');

        cy.window().then(win => win.datatable.getColumn(2))
            .its('sortOrder')
            .should('eq', 'asc');

        cy.window().then(win => win.datatable.datamanager)
            .its('currentSort.colIndex')
            .should('eq', 2);

        cy.get('.dt-scrollable .dt-row:first div:nth-of-type(3)')
            .contains('Airi Satou');

        cy.clickDropdownItem(2, 'Reset sorting');
    });

    it('removes column using dropdown action', function () {
        cy.get('.dt-cell--header').should('have.length', 12);

        cy.clickDropdown(5);
        cy.clickDropdownItem(5, 'Remove column');

        cy.get('.dt-cell--header').should('have.length', 11);
    });

    it('resize column with mouse drag', function () {
        cy.get('.dt-cell--header-4 .dt-cell__resize-handle').as('resize-handle');
        cy
            .get('@resize-handle')
            .trigger('mousedown')
            .trigger('mousemove', { pageX: 700, pageY: 20, which: 1 })
            .trigger('mouseup');

        cy.getColumnCell(4).invoke('css', 'width').then((width) => {
            cy.getColumnCell(4)
                .should('have.css', 'width', width);
            cy.getCell(4, 1)
                .should('have.css', 'width', width);
        });
    });

    it('resize column using double click', function () {
        cy.get('.dt-cell--header-4 .dt-cell__resize-handle').trigger('dblclick');
        cy.getColumnCell(4).should('have.css', 'width')
            .and('match', /9\dpx/);
        cy.getCell(4, 1).should('have.css', 'width')
            .and('match', /9\dpx/);
    });

    it('pins a column from the dropdown menu', function () {
        cy.clickDropdown(2);
        cy.clickDropdownItem(2, 'Stick to left');

        cy.window().then(win => win.datatable.getColumn(2))
            .its('sticky')
            .should('eq', true);

        cy.get('.dt-scrollable').then(($scrollable) => {
            const scrollable = $scrollable[0];
            const stickyBodyCell = Cypress.$('.dt-cell--2-0')[0];
            const initialStickyBodyLeft = stickyBodyCell.getBoundingClientRect().left;

            scrollable.scrollLeft = 220;
            scrollable.dispatchEvent(new Event('scroll'));

            cy.wait(50).then(() => {
                const nextStickyBodyLeft = stickyBodyCell.getBoundingClientRect().left;
                expect(nextStickyBodyLeft).to.be.closeTo(initialStickyBodyLeft, 1);
            });
        });
    });

    it('keeps sticky columns pinned while scrolling horizontally', function () {
        const expectPinned = (actual, expected) => {
            expect(actual).to.be.closeTo(expected, 1);
        };

        cy.get('.dt-scrollable').then(($scrollable) => {
            const scrollable = $scrollable[0];
            const stickyCheckboxBodyCell = Cypress.$('.dt-cell--0-0')[0];
            const stickyCheckboxHeaderCell = Cypress.$('.dt-cell--header-0')[0];
            const stickySerialBodyCell = Cypress.$('.dt-cell--1-0')[0];
            const stickySerialHeaderCell = Cypress.$('.dt-cell--header-1')[0];
            const stickyCustomBodyCell = Cypress.$('.dt-cell--4-0')[0];
            const stickyCustomHeaderCell = Cypress.$('.dt-cell--header-4')[0];
            const regularBodyCell = Cypress.$('.dt-cell--2-0')[0];

            const initialStickyCheckboxBodyLeft = stickyCheckboxBodyCell.getBoundingClientRect().left;
            const initialStickyCheckboxHeaderLeft = stickyCheckboxHeaderCell.getBoundingClientRect().left;
            const initialStickySerialBodyLeft = stickySerialBodyCell.getBoundingClientRect().left;
            const initialStickySerialHeaderLeft = stickySerialHeaderCell.getBoundingClientRect().left;
            const initialStickyCustomBodyLeft = stickyCustomBodyCell.getBoundingClientRect().left;
            const initialStickyCustomHeaderLeft = stickyCustomHeaderCell.getBoundingClientRect().left;
            const initialRegularBodyLeft = regularBodyCell.getBoundingClientRect().left;

            scrollable.scrollLeft = 220;
            scrollable.dispatchEvent(new Event('scroll'));

            cy.wait(50).then(() => {
                const nextStickyCheckboxBodyLeft = stickyCheckboxBodyCell.getBoundingClientRect().left;
                const nextStickyCheckboxHeaderLeft = stickyCheckboxHeaderCell.getBoundingClientRect().left;
                const nextStickySerialBodyLeft = stickySerialBodyCell.getBoundingClientRect().left;
                const nextStickySerialHeaderLeft = stickySerialHeaderCell.getBoundingClientRect().left;
                const nextStickyCustomBodyLeft = stickyCustomBodyCell.getBoundingClientRect().left;
                const nextStickyCustomHeaderLeft = stickyCustomHeaderCell.getBoundingClientRect().left;
                const nextRegularBodyLeft = regularBodyCell.getBoundingClientRect().left;

                expectPinned(nextStickyCheckboxBodyLeft, initialStickyCheckboxBodyLeft);
                expectPinned(nextStickyCheckboxHeaderLeft, initialStickyCheckboxHeaderLeft);
                expectPinned(nextStickySerialBodyLeft, initialStickySerialBodyLeft);
                expectPinned(nextStickySerialHeaderLeft, initialStickySerialHeaderLeft);
                expectPinned(nextStickyCustomBodyLeft, initialStickyCustomBodyLeft);
                expectPinned(nextStickyCustomHeaderLeft, initialStickyCustomHeaderLeft);
                expect(nextRegularBodyLeft).to.be.lessThan(initialRegularBodyLeft);
            });
        });
    });
});
