describe('Edit operation', function () {
	beforeEach('Auth', function () {
		cy.setCookie('sneaky', 'admin');
		cy.setCookie('hummingbird', 'admin');
	});

	it('Visits Web and navigate to Dashboard', function () {
		cy.visit('http://localhost:2000/dashboard/operations');
		cy.contains('edit_on_map').click();
		cy.window().then((win) => {
			win.store.mapStore.editOperationVolumePoint(0, 0, 0, 0);
			win.store.mapStore.removeOperationVolumePoint(0, 0);
		});
	});
});
