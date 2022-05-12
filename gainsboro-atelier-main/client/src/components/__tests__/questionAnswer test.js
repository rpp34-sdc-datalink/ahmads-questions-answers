// Polyfill "window.fetch" used in the React component.
import 'whatwg-fetch'

import React from 'react'
import {rest} from 'msw'
import {setupServer} from 'msw/node'
import {render, fireEvent, waitFor, screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import QuestionAnswer from '../QuestionsAndAnswers/QuestionAnswer.jsx'

import { sampleQA } from '../fixtures/qa';

const server = setupServer(
    rest.get('/qa/questions', (req, res, ctx) => {
      return res(ctx.json(sampleQA))
    }),
  )
  
  
describe('QA Component', () => {
    beforeAll(() => server.listen())
    afterEach(() => server.resetHandlers())
    afterAll(() => server.close())
    it('renders', async () => {
        render(<QuestionAnswer productId="123" overview=""/>)
        
        await waitFor(() => screen.getByRole('heading', { level: 2 }))
    
        expect(screen.getByRole('heading', {level: 2})).toHaveTextContent('Questions and Answers')
    })
})