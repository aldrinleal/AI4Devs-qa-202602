/**
 * E2E tests for the Position/Kanban board page.
 *
 * Prerequisites: backend on :3010, frontend on :3000.
 * Run: npx cypress open  (from frontend/)
 */

const POSITION_ID = 1;
const API = 'http://localhost:3010';

// Mock data that mirrors what the backend seed produces
const mockInterviewFlow = {
  interviewFlow: {
    positionName: 'Senior Software Engineer',
    interviewFlow: {
      id: 1,
      description: 'Standard flow',
      interviewSteps: [
        { id: 1, name: 'CV Review', orderIndex: 0 },
        { id: 2, name: 'Phone Screen', orderIndex: 1 },
        { id: 3, name: 'Technical Interview', orderIndex: 2 },
        { id: 4, name: 'Manager Interview', orderIndex: 3 },
      ],
    },
  },
};

const mockCandidates = [
  {
    fullName: 'John Doe',
    currentInterviewStep: 'CV Review',
    candidateId: 1,
    applicationId: 1,
    averageScore: 3,
  },
  {
    fullName: 'Jane Smith',
    currentInterviewStep: 'Phone Screen',
    candidateId: 2,
    applicationId: 2,
    averageScore: 4,
  },
  {
    fullName: 'Alice Johnson',
    currentInterviewStep: 'Technical Interview',
    candidateId: 3,
    applicationId: 3,
    averageScore: 5,
  },
];

// Helper: simulate a drag from source card to destination column using mouse events.
// react-beautiful-dnd uses pointer events — this helper covers the minimum required sequence.
function dragCandidateToColumn(candidateName, destColumnTitle) {
  cy.contains('.card', candidateName).as('source');
  cy.contains('.card-header', destColumnTitle).closest('.col-md-3').as('dest');

  cy.get('@dest').then(($dest) => {
    const destRect = $dest[0].getBoundingClientRect();
    const destX = destRect.left + destRect.width / 2;
    const destY = destRect.top + destRect.height / 2;

    cy.get('@source')
      .trigger('mousedown', { button: 0, force: true })
      .trigger('mousemove', { clientX: destX - 5, clientY: destY, force: true });

    cy.get('body').trigger('mousemove', { clientX: destX, clientY: destY, force: true });
    cy.get('@dest').trigger('mousemove', { clientX: destX, clientY: destY, force: true });
    cy.get('body').trigger('mouseup', { clientX: destX, clientY: destY, force: true });
  });
}

describe('Position page — Kanban board', () => {
  beforeEach(() => {
    // Stub backend responses so tests run without a live database
    cy.intercept('GET', `${API}/positions/${POSITION_ID}/interviewFlow`, mockInterviewFlow).as(
      'getFlow'
    );
    cy.intercept('GET', `${API}/positions/${POSITION_ID}/candidates`, mockCandidates).as(
      'getCandidates'
    );

    cy.visit(`/positions/${POSITION_ID}`);
    cy.wait('@getFlow');
    cy.wait('@getCandidates');
  });

  // ---------------------------------------------------------------
  // 1. Page load
  // ---------------------------------------------------------------
  describe('Page load', () => {
    it('displays the position title', () => {
      cy.contains('h2', mockInterviewFlow.interviewFlow.positionName).should('be.visible');
    });

    it('renders a column for each interview phase', () => {
      const steps = mockInterviewFlow.interviewFlow.interviewFlow.interviewSteps;
      steps.forEach((step) => {
        cy.contains('.card-header', step.name).should('be.visible');
      });
    });

    it('shows candidate cards in the correct column', () => {
      mockCandidates.forEach((candidate) => {
        // Find the column whose header matches the candidate's current step
        cy.contains('.card-header', candidate.currentInterviewStep)
          .closest('.col-md-3')
          .within(() => {
            cy.contains('.card-title', candidate.fullName).should('be.visible');
          });
      });
    });
  });

  // ---------------------------------------------------------------
  // 2. Drag-and-drop phase change
  // ---------------------------------------------------------------
  describe('Candidate phase change via drag and drop', () => {
    it('moves the candidate card to the destination column', () => {
      const candidate = mockCandidates[0]; // John Doe — starts in CV Review
      const targetStep = 'Phone Screen';

      // Intercept the PUT before triggering drag
      cy.intercept('PUT', `${API}/candidates/${candidate.candidateId}`, {
        statusCode: 200,
        body: { message: 'Candidate stage updated successfully' },
      }).as('updateCandidate');

      dragCandidateToColumn(candidate.fullName, targetStep);

      // After drag the card should appear in the new column
      cy.contains('.card-header', targetStep)
        .closest('.col-md-3')
        .within(() => {
          cy.contains('.card-title', candidate.fullName).should('exist');
        });
    });

    it('calls PUT /candidates/:id with the new interview step id', () => {
      const candidate = mockCandidates[0]; // John Doe
      const targetStep = mockInterviewFlow.interviewFlow.interviewFlow.interviewSteps[1]; // Phone Screen (id: 2)

      cy.intercept('PUT', `${API}/candidates/${candidate.candidateId}`, (req) => {
        // Validate the request body
        expect(req.body).to.include({
          applicationId: candidate.applicationId,
          currentInterviewStep: targetStep.id,
        });
        req.reply({ statusCode: 200, body: { message: 'Candidate stage updated successfully' } });
      }).as('updateCandidate');

      dragCandidateToColumn(candidate.fullName, targetStep.name);

      cy.wait('@updateCandidate').its('response.statusCode').should('eq', 200);
    });
  });
});
