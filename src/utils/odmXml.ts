import * as bcrypt from 'bcrypt';
import { encrypt } from './cipher';
import { randomUUID } from 'node:crypto';
import { TestData } from '../nof1-data/dto/create-nof1-data.dto';
import { Nof1Test } from '../nof1-tests/schemas/nof1Test.schema';
import { VariableType } from '../nof1-tests/@types/types';
import { Patient } from '../persons/patients/schemas/patient.schema';
import { Physician } from '../persons/physicians/schemas/physician.schema';
import { Pharmacy } from '../persons/schemas/pharmacy.schema';

/**
 * Generates an XML string representing an XML file, in ODM-XML format,
 * containing all the information about a N-of-1 test and its patient's data.
 * @param test N-of-1 test.
 * @param data Patient's data fo the N-of-1 test.
 * @returns An XML string.
 */
export const generateOdmXML = (test: Nof1Test, data: TestData) => {
  const date = new Date().toISOString();
  return `<?xml version="1.0" encoding="UTF-8"?>
<ODM xmlns="http://www.cdisc.org/ns/odm/v1.3"
   xmlns:ds="http://www.w3.org/2000/09/xmldsig#"
   xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
   xsi:schemaLocation="http://www.cdisc.org/ns/odm/v1.3 ODM1-3-2.xsd"
   ODMVersion="1.3.2"
   FileOID="nof1companion/${test.uid}/1"
   FileType="Snapshot"
   Description="File containing all information about the Nof1 test with ID ${
     test.uid
   }"
   CreationDateTime="${date}"
   AsOfDateTime="${date}">

   <Study OID="Study.nof1">
      <GlobalVariables>
         <StudyName>Nof1 therapeutic test</StudyName>
         <StudyDescription>A Nof1 therapeutic test to compare the following treatments : ${test.substances.map(
           (s) => s.name,
         )}</StudyDescription>
         <ProtocolName>Nof1 therapeutic test</ProtocolName>
      </GlobalVariables>
      <MetaDataVersion OID="Metadata.nof1-${date}" Name="Nof1 Metadata">
         <Protocol>
            <StudyEventRef StudyEventOID="Event.design" Mandatory="Yes" />
            <StudyEventRef StudyEventOID="Event.data" Mandatory="Yes" />
         </Protocol>

         <!-- Design -->
         <StudyEventDef OID="Event.design" Name="Nof1 design" Repeating="No" Type="Scheduled">
            <FormRef FormOID="Form.participant-patient" Mandatory="Yes" />
            <FormRef FormOID="Form.participant-physician" Mandatory="Yes" />
            <FormRef FormOID="Form.participant-pharmacy" Mandatory="Yes" />
            <FormRef FormOID="Form.clinicalInfo" Mandatory="No" />
            <FormRef FormOID="Form.nof1-parameters" Mandatory="Yes" />
            <FormRef FormOID="Form.nof1-substance-parameters" Mandatory="Yes" />
            <FormRef FormOID="Form.nof1-monitoredVariables-def" Mandatory="Yes" />
         </StudyEventDef>

         <!-- Data -->
         <StudyEventDef OID="Event.data" Name="Nof1 patient data" Repeating="Yes" Type="Scheduled">
            <FormRef FormOID="Form.nof1-monitoredVariables" Mandatory="Yes" />
         </StudyEventDef>

         <!-- Participants -->
         <FormDef OID="Form.participant-patient" Name="Patient info form" Repeating="No">
            <ItemGroupRef ItemGroupOID="ItemGroup.participant-common-info" Mandatory="Yes" />
            <ItemGroupRef ItemGroupOID="ItemGroup.participant-patient" Mandatory="Yes" />
         </FormDef>
         <FormDef OID="Form.participant-physician" Name="Physician info form" Repeating="Yes">
            <ItemGroupRef ItemGroupOID="ItemGroup.participant-common-info" Mandatory="Yes" />
            <ItemGroupRef ItemGroupOID="ItemGroup.participant-physician" Mandatory="Yes" />
         </FormDef>
         <FormDef OID="Form.participant-pharmacy" Name="Pharmacy info form" Repeating="No">
            <ItemGroupRef ItemGroupOID="ItemGroup.participant-pharmacy" Mandatory="Yes" />
         </FormDef>

         <!-- Clinical info -->
         <FormDef OID="Form.clinicalInfo" Name="Clinical information" Repeating="No">
            <ItemGroupRef ItemGroupOID="ItemGroup.clinicalInfo" Mandatory="Yes" />
         </FormDef>

         <!-- Nof1 parameters -->
         <FormDef OID="Form.nof1-parameters" Name="Nof1 parameters" Repeating="No">
            <ItemGroupRef ItemGroupOID="ItemGroup.nof1-parameters" Mandatory="Yes" />
         </FormDef>
         <FormDef OID="Form.nof1-substance-parameters" Name="Nof1 substance parameters" Repeating="Yes">
            <ItemGroupRef ItemGroupOID="ItemGroup.nof1-substance" Mandatory="Yes" />
            <ItemGroupRef ItemGroupOID="ItemGroup.nof1-posology" Mandatory="Yes" />
            <ItemGroupRef ItemGroupOID="ItemGroup.nof1-decreasing-posology" Mandatory="No" />
         </FormDef>

         <!-- Nof1 variables def -->
         <FormDef OID="Form.nof1-monitoredVariables-def" Name="Nof1 monitored variables def" Repeating="No">
            <ItemGroupRef ItemGroupOID="ItemGroup.nof1-monitoredVariables-def" Mandatory="Yes" />
         </FormDef>

         <!-- Data -->
         <FormDef OID="Form.nof1-monitoredVariables" Name="Nof1 monitored variables" Repeating="No">
            <ItemGroupRef ItemGroupOID="ItemGroup.nof1-monitoredVariables" Mandatory="Yes" />
         </FormDef>

         <!-- Participants -->
         <ItemGroupDef OID="ItemGroup.participant-common-info" Name="Common person info" Repeating="No">
            <ItemRef ItemOID="Item.lastname" Mandatory="Yes" />
            <ItemRef ItemOID="Item.firstname" Mandatory="Yes" />
            <ItemRef ItemOID="Item.phone" Mandatory="Yes" />
            <ItemRef ItemOID="Item.email" Mandatory="Yes" />
            <ItemRef ItemOID="Item.street" Mandatory="No" />
            <ItemRef ItemOID="Item.zip" Mandatory="No" />
            <ItemRef ItemOID="Item.city" Mandatory="No" />
            <ItemRef ItemOID="Item.country" Mandatory="No" />
         </ItemGroupDef>
         <ItemGroupDef OID="ItemGroup.participant-patient" Name="Patient specific info" Repeating="No">
            <ItemRef ItemOID="Item.insurance" Mandatory="Yes" />
            <ItemRef ItemOID="Item.insurance-nb" Mandatory="Yes" />
         </ItemGroupDef>
         <ItemGroupDef OID="ItemGroup.participant-physician" Name="Physician specific info" Repeating="No">
            <ItemRef ItemOID="Item.institution" Mandatory="Yes" />
            <!-- <ItemRef ItemOID="Item.tests" Mandatory="No"/> -->
         </ItemGroupDef>
         <ItemGroupDef OID="ItemGroup.participant-pharmacy" Name="Pharmacy info" Repeating="No">
            <ItemRef ItemOID="Item.name" Mandatory="No" />
            <ItemRef ItemOID="Item.phone" Mandatory="No" />
            <ItemRef ItemOID="Item.email" Mandatory="Yes" />
            <ItemRef ItemOID="Item.street" Mandatory="No" />
            <ItemRef ItemOID="Item.zip" Mandatory="No" />
            <ItemRef ItemOID="Item.city" Mandatory="No" />
            <ItemRef ItemOID="Item.country" Mandatory="No" />
         </ItemGroupDef>

         <!-- Clinical info -->
         <ItemGroupDef OID="ItemGroup.clinicalInfo" Name="Clinical information" Repeating="No">
            <ItemRef ItemOID="Item.sex" Mandatory="No" />
            <ItemRef ItemOID="Item.age" Mandatory="No" />
            <ItemRef ItemOID="Item.weight" Mandatory="No" />
            <ItemRef ItemOID="Item.height" Mandatory="No" />
            <ItemRef ItemOID="Item.drugsToTest" Mandatory="No" />
            <ItemRef ItemOID="Item.indication" Mandatory="No" />
            <ItemRef ItemOID="Item.otherDiagnoses" Mandatory="No" />
            <ItemRef ItemOID="Item.otherMedications" Mandatory="No" />
            <ItemRef ItemOID="Item.purpose-efficacy" Mandatory="No" />
            <ItemRef ItemOID="Item.purpose-side-effects" Mandatory="No" />
            <ItemRef ItemOID="Item.purpose-deprescription" Mandatory="No" />
            <ItemRef ItemOID="Item.purpose-dosage" Mandatory="No" />
            <ItemRef ItemOID="Item.purpose-drugs-choice" Mandatory="No" />
            <ItemRef ItemOID="Item.purpose-generic-substitution" Mandatory="No" />
            <ItemRef ItemOID="Item.purpose-other" Mandatory="No" />
         </ItemGroupDef>

         <!-- Nof1 parameters -->
         <ItemGroupDef OID="ItemGroup.nof1-parameters" Name="Nof1 parameters" Repeating="No">
            <ItemRef ItemOID="Item.nbPeriods" Mandatory="Yes" />
            <ItemRef ItemOID="Item.periodLen" Mandatory="Yes" />
            <ItemRef ItemOID="Item.statisticalAnalysis" Mandatory="Yes" />
            <ItemRef ItemOID="Item.randomizationStrategy" Mandatory="Yes" />
            <ItemRef ItemOID="Item.administrationSequence" Mandatory="Yes" />
         </ItemGroupDef>
         <ItemGroupDef OID="ItemGroup.nof1-substance" Name="Nof1 parameters" Repeating="No">
            <ItemRef ItemOID="Item.substance" Mandatory="Yes" />
            <ItemRef ItemOID="Item.abbreviation" Mandatory="Yes" />
            <ItemRef ItemOID="Item.unit" Mandatory="Yes" />
            <ItemRef ItemOID="Item.repeatLast" Mandatory="Yes" />
         </ItemGroupDef>
         <ItemGroupDef OID="ItemGroup.nof1-posology" Name="Posology" Repeating="Yes">
            <ItemRef ItemOID="Item.day" Mandatory="Yes" />
            <ItemRef ItemOID="Item.morningDose" Mandatory="Yes" />
            <ItemRef ItemOID="Item.morningFraction" Mandatory="Yes" />
            <ItemRef ItemOID="Item.noonDose" Mandatory="Yes" />
            <ItemRef ItemOID="Item.noonFraction" Mandatory="Yes" />
            <ItemRef ItemOID="Item.eveningDose" Mandatory="Yes" />
            <ItemRef ItemOID="Item.eveningFraction" Mandatory="Yes" />
            <ItemRef ItemOID="Item.nightDose" Mandatory="Yes" />
            <ItemRef ItemOID="Item.nightFraction" Mandatory="Yes" />
         </ItemGroupDef>
         <ItemGroupDef OID="ItemGroup.nof1-decreasing-posology" Name="Decreasing posology" Repeating="Yes">
            <ItemRef ItemOID="Item.day" Mandatory="Yes" />
            <ItemRef ItemOID="Item.morningDose" Mandatory="Yes" />
            <ItemRef ItemOID="Item.morningFraction" Mandatory="Yes" />
            <ItemRef ItemOID="Item.noonDose" Mandatory="Yes" />
            <ItemRef ItemOID="Item.noonFraction" Mandatory="Yes" />
            <ItemRef ItemOID="Item.eveningDose" Mandatory="Yes" />
            <ItemRef ItemOID="Item.eveningFraction" Mandatory="Yes" />
            <ItemRef ItemOID="Item.nightDose" Mandatory="Yes" />
            <ItemRef ItemOID="Item.nightFraction" Mandatory="Yes" />
         </ItemGroupDef>

         <!-- Nof1 variables def -->
         <ItemGroupDef OID="ItemGroup.nof1-monitoredVariables-def" Name="Monitored variable parameters" Repeating="Yes">
            <ItemRef ItemOID="Item.VarName" Mandatory="Yes" />
            <ItemRef ItemOID="Item.VarType" Mandatory="Yes" />
            <ItemRef ItemOID="Item.unit" Mandatory="No" />
            <ItemRef ItemOID="Item.min" Mandatory="No" />
            <ItemRef ItemOID="Item.max" Mandatory="No" />
            <ItemRef ItemOID="Item.values" Mandatory="No" />
            <ItemRef ItemOID="Item.skippedRunInDays" Mandatory="No" />
         </ItemGroupDef>

         <!-- Data -->
         <ItemGroupDef OID="ItemGroup.nof1-monitoredVariables" Name="Monitored variable" Repeating="No">
            ${test.monitoredVariables.reduce((acc, v, idx) => {
              const tab = idx > 0 ? '\n            ' : ''; // for indentation
              acc += `${tab}<ItemRef ItemOID="Item.${v.name
                .toLowerCase()
                .replaceAll(' ', '-')}" Mandatory="Yes" />`;
              return acc;
            }, '')}
            <ItemRef ItemOID="Item.supposition" Mandatory="No" />
            <ItemRef ItemOID="Item.optimal" Mandatory="No" />
            <ItemRef ItemOID="Item.endPeriodRemark" Mandatory="No" />
         </ItemGroupDef>
         ${test.monitoredVariables.reduce((acc, v, idx) => {
           const tab = idx > 0 ? '\n         ' : ''; // for indentation
           acc += `${tab}<ItemDef OID="Item.${v.name
             .toLowerCase()
             .replaceAll(' ', '-')}" Name="${
             v.name
           }" DataType="string" Length="500">
            <Question>
               <TranslatedText>${v.desc}</TranslatedText>
            </Question>
         </ItemDef>`;
           return acc;
         }, '')}
         <ItemDef OID="Item.supposition" Name="Patient's assumption about treatment" DataType="string" Length="64"></ItemDef>
         <ItemDef OID="Item.optimal" Name="Patient's assumption about the optimality of the treatment" DataType="string" Length="64"></ItemDef>
         <ItemDef OID="Item.endPeriodRemark" Name="Remarks about the treatment assumption and optimality" DataType="string" Length="500"></ItemDef>

         <!-- Participants. Length arbitrary long to accommodate encrypted strings, when generating encrypted xml. -->
         <ItemDef OID="Item.lastname" Name="lastname" DataType="string" Length="500"></ItemDef>
         <ItemDef OID="Item.firstname" Name="firstname" DataType="string" Length="500"></ItemDef>
         <ItemDef OID="Item.phone" Name="phone" DataType="string" Length="500"></ItemDef>
         <ItemDef OID="Item.email" Name="email" DataType="string" Length="500"></ItemDef>
         <ItemDef OID="Item.street" Name="street" DataType="string" Length="500"></ItemDef>
         <ItemDef OID="Item.zip" Name="zip" DataType="string" Length="500"></ItemDef>
         <ItemDef OID="Item.city" Name="city" DataType="string" Length="500"></ItemDef>
         <ItemDef OID="Item.country" Name="country" DataType="string" Length="128"></ItemDef>
         <ItemDef OID="Item.insurance" Name="insurance" DataType="string" Length="500"></ItemDef>
         <ItemDef OID="Item.insurance-nb" Name="insurance number" DataType="string" Length="500"></ItemDef>
         <ItemDef OID="Item.institution" Name="institution" DataType="string" Length="128"></ItemDef>
         <ItemDef OID="Item.name" Name="name" DataType="string" Length="500"></ItemDef>

         <!-- Clinical info -->
         <ItemDef OID="Item.sex" Name="Sex" DataType="string" Length="16"></ItemDef>
         <ItemDef OID="Item.age" Name="Age" DataType="string" Length="3"></ItemDef>
         <ItemDef OID="Item.weight" Name="Weight" DataType="string" Length="6"></ItemDef>
         <ItemDef OID="Item.height" Name="Height" DataType="string" Length="6"></ItemDef>
         <ItemDef OID="Item.drugsToTest" Name="Drugs to test" DataType="string" Length="500"></ItemDef>
         <ItemDef OID="Item.indication" Name="Indication for the drug to be tested" DataType="string" Length="500"></ItemDef>
         <ItemDef OID="Item.otherDiagnoses" Name="Other important diagnoses" DataType="string" Length="500"></ItemDef>
         <ItemDef OID="Item.otherMedications" Name="Other current medications" DataType="string" Length="500"></ItemDef>
         <ItemDef OID="Item.purpose-efficacy" Name="Assessment of efficacy" DataType="boolean"></ItemDef>
         <ItemDef OID="Item.purpose-side-effects" Name="Assessment of side effect(s)" DataType="boolean"></ItemDef>
         <ItemDef OID="Item.purpose-deprescription" Name="Deprescription" DataType="boolean"></ItemDef>
         <ItemDef OID="Item.purpose-dosage" Name="Searching for a dose" DataType="boolean"></ItemDef>
         <ItemDef OID="Item.purpose-drugs-choice" Name="Choice between drugs" DataType="boolean"></ItemDef>
         <ItemDef OID="Item.purpose-generic-substitution" Name="Generic/biosimilar substitution" DataType="boolean"></ItemDef>
         <ItemDef OID="Item.purpose-other" Name="Other" DataType="boolean"></ItemDef>

         <!-- Nof1 parameters -->
         <ItemDef OID="Item.nbPeriods" Name="Number of periods" DataType="integer"></ItemDef>
         <ItemDef OID="Item.periodLen" Name="Period Length" DataType="integer"></ItemDef>
         <ItemDef OID="Item.statisticalAnalysis" Name="Selected statistical analysis method" DataType="string" Length="64"></ItemDef>
         <ItemDef OID="Item.randomizationStrategy" Name="Randomization strategy" DataType="string" Length="64"></ItemDef>
         <ItemDef OID="Item.administrationSequence" Name="Substances administration sequence" DataType="string" Length="64"></ItemDef>
         <ItemDef OID="Item.substance" Name="Substance" DataType="string" Length="64"></ItemDef>
         <ItemDef OID="Item.abbreviation" Name="Abbreviation" DataType="string" Length="32"></ItemDef>
         <ItemDef OID="Item.unit" Name="Unit" DataType="string" Length="32"></ItemDef>
         <ItemDef OID="Item.repeatLast" Name="Repeat posology" DataType="boolean"></ItemDef>
         <ItemDef OID="Item.day" Name="Day" DataType="integer"></ItemDef>
         <ItemDef OID="Item.morningDose" Name="Morning Dose" DataType="integer"></ItemDef>
         <ItemDef OID="Item.morningFraction" Name="Morning Fraction" DataType="integer"></ItemDef>
         <ItemDef OID="Item.noonDose" Name="Noon Dose" DataType="integer"></ItemDef>
         <ItemDef OID="Item.noonFraction" Name="Noon Fraction" DataType="integer"></ItemDef>
         <ItemDef OID="Item.eveningDose" Name="Evening Dose" DataType="integer"></ItemDef>
         <ItemDef OID="Item.eveningFraction" Name="Evening Fraction" DataType="integer"></ItemDef>
         <ItemDef OID="Item.nightDose" Name="Night Dose" DataType="integer"></ItemDef>
         <ItemDef OID="Item.nightFraction" Name="Night Fraction" DataType="integer"></ItemDef>

         <!-- Nof1 variables def -->
         <ItemDef OID="Item.VarName" Name="VarName" DataType="string" Length="64"></ItemDef>
         <ItemDef OID="Item.VarType" Name="VarType" DataType="string" Length="64"></ItemDef>
         <ItemDef OID="Item.min" Name="min" DataType="string" Length="64"></ItemDef>
         <ItemDef OID="Item.max" Name="max" DataType="string" Length="64"></ItemDef>
         <ItemDef OID="Item.values" Name="values" DataType="string" Length="64"></ItemDef>
         <ItemDef OID="Item.skippedRunInDays" Name="skippedRunInDays" DataType="integer"></ItemDef>
      </MetaDataVersion>
   </Study>

   <AdminData>
      <User OID="${
        test.participants.nof1Physician.email
      }" UserType="Investigator">
         <FirstName>${test.participants.nof1Physician.firstname}</FirstName>
         <LastName>${test.participants.nof1Physician.lastname}</LastName>
         <Organization>${
           test.participants.nof1Physician.institution
         }</Organization>
         <Address>
            <StreetName>${
              test.participants.nof1Physician.address.street
            }</StreetName>
            <City>${test.participants.nof1Physician.address.city}</City>
            <Country>${
              test.participants.nof1Physician.address.country
            }</Country>
            <PostalCode>${
              test.participants.nof1Physician.address.zip
            }</PostalCode>
         </Address>
         <Email>${test.participants.nof1Physician.email}</Email>
         <Phone>${test.participants.nof1Physician.phone}</Phone>
      </User>
   </AdminData>

   <ClinicalData StudyOID="Study.nof1" MetaDataVersionOID="Metadata.nof1-${date}">
      <SubjectData SubjectKey="${randomUUID()}">
         <!-- Design -->
         <StudyEventData StudyEventOID="Event.design">
            <FormData FormOID="Form.participant-patient">
               <ItemGroupData ItemGroupOID="ItemGroup.participant-common-info">
                  <ItemDataString ItemOID="Item.lastname">
                     <![CDATA[${test.participants.patient.lastname}]]>
                  </ItemDataString>
                  <ItemDataString ItemOID="Item.firstname">
                     <![CDATA[${test.participants.patient.firstname}]]>
                  </ItemDataString>
                  <ItemDataString ItemOID="Item.phone">
                     <![CDATA[${test.participants.patient.phone}]]>
                  </ItemDataString>
                  <ItemDataString ItemOID="Item.email">
                     <![CDATA[${test.participants.patient.email}]]>
                  </ItemDataString>
                  <ItemDataString ItemOID="Item.street">
                     <![CDATA[${test.participants.patient.address.street}]]>
                  </ItemDataString>
                  <ItemDataString ItemOID="Item.zip">
                     <![CDATA[${test.participants.patient.address.zip}]]>
                  </ItemDataString>
                  <ItemDataString ItemOID="Item.city">
                     <![CDATA[${test.participants.patient.address.city}]]>
                  </ItemDataString>
                  <ItemDataString ItemOID="Item.country">
                     <![CDATA[${test.participants.patient.address.country}]]>
                  </ItemDataString>
               </ItemGroupData>
               <ItemGroupData ItemGroupOID="ItemGroup.participant-patient">
                  <ItemDataString ItemOID="Item.insurance">
                     <![CDATA[${test.participants.patient.insurance}]]>
                  </ItemDataString>
                  <ItemDataString ItemOID="Item.insurance-nb">
                     <![CDATA[${test.participants.patient.insuranceNb}]]>
                  </ItemDataString>
               </ItemGroupData>
            </FormData>
            <FormData FormOID="Form.participant-physician">
               <ItemGroupData ItemGroupOID="ItemGroup.participant-common-info">
                  <ItemDataString ItemOID="Item.lastname">
                     <![CDATA[${
                       test.participants.requestingPhysician.lastname
                     }]]>
                  </ItemDataString>
                  <ItemDataString ItemOID="Item.firstname">
                     <![CDATA[${
                       test.participants.requestingPhysician.firstname
                     }]]>
                  </ItemDataString>
                  <ItemDataString ItemOID="Item.phone">
                     <![CDATA[${test.participants.requestingPhysician.phone}]]>
                  </ItemDataString>
                  <ItemDataString ItemOID="Item.email">
                     <![CDATA[${test.participants.requestingPhysician.email}]]>
                  </ItemDataString>
                  <ItemDataString ItemOID="Item.street">
                     <![CDATA[${
                       test.participants.requestingPhysician.address.street
                     }]]>
                  </ItemDataString>
                  <ItemDataString ItemOID="Item.zip">
                     <![CDATA[${
                       test.participants.requestingPhysician.address.zip
                     }]]>
                  </ItemDataString>
                  <ItemDataString ItemOID="Item.city">
                     <![CDATA[${
                       test.participants.requestingPhysician.address.city
                     }]]>
                  </ItemDataString>
                  <ItemDataString ItemOID="Item.country">
                     <![CDATA[${
                       test.participants.requestingPhysician.address.country
                     }]]>
                  </ItemDataString>
               </ItemGroupData>
               <ItemGroupData ItemGroupOID="ItemGroup.participant-physician">
                  <ItemDataString ItemOID="Item.institution">
                     <![CDATA[${
                       test.participants.requestingPhysician.institution
                     }]]>
                  </ItemDataString>
               </ItemGroupData>
            </FormData>${
              test.participants.attendingPhysician
                ? `
            <FormData FormOID="Form.participant-physician">
               <ItemGroupData ItemGroupOID="ItemGroup.participant-common-info">
                  <ItemDataString ItemOID="Item.lastname">
                     <![CDATA[${test.participants.attendingPhysician.lastname}]]>
                  </ItemDataString>
                  <ItemDataString ItemOID="Item.firstname">
                     <![CDATA[${test.participants.attendingPhysician.firstname}]]>
                  </ItemDataString>
                  <ItemDataString ItemOID="Item.phone">
                     <![CDATA[${test.participants.attendingPhysician.phone}]]>
                  </ItemDataString>
                  <ItemDataString ItemOID="Item.email">
                     <![CDATA[${test.participants.attendingPhysician.email}]]>
                  </ItemDataString>
                  <ItemDataString ItemOID="Item.street">
                     <![CDATA[${test.participants.attendingPhysician.address.street}]]>
                  </ItemDataString>
                  <ItemDataString ItemOID="Item.zip">
                     <![CDATA[${test.participants.attendingPhysician.address.zip}]]>
                  </ItemDataString>
                  <ItemDataString ItemOID="Item.city">
                     <![CDATA[${test.participants.attendingPhysician.address.city}]]>
                  </ItemDataString>
                  <ItemDataString ItemOID="Item.country">
                     <![CDATA[${test.participants.attendingPhysician.address.country}]]>
                  </ItemDataString>
               </ItemGroupData>
               <ItemGroupData ItemGroupOID="ItemGroup.participant-physician">
                  <ItemDataString ItemOID="Item.institution">
                     <![CDATA[${test.participants.attendingPhysician.institution}]]>
                  </ItemDataString>
               </ItemGroupData>
            </FormData>`
                : ''
            }
            <FormData FormOID="Form.participant-pharmacy">
               <ItemGroupData ItemGroupOID="ItemGroup.participant-pharmacy">
                  <ItemDataString ItemOID="Item.name">
                     <![CDATA[${test.participants.pharmacy.name}]]>
                  </ItemDataString>
                  <ItemDataString ItemOID="Item.phone">
                     <![CDATA[${test.participants.pharmacy.phone}]]>
                  </ItemDataString>
                  <ItemDataString ItemOID="Item.email">
                     <![CDATA[${test.participants.pharmacy.email}]]>
                  </ItemDataString>
                  <ItemDataString ItemOID="Item.street">
                     <![CDATA[${test.participants.pharmacy.address.street}]]>
                  </ItemDataString>
                  <ItemDataString ItemOID="Item.zip">
                     <![CDATA[${test.participants.pharmacy.address.zip}]]>
                  </ItemDataString>
                  <ItemDataString ItemOID="Item.city">
                     <![CDATA[${test.participants.pharmacy.address.city}]]>
                  </ItemDataString>
                  <ItemDataString ItemOID="Item.country">
                     <![CDATA[${test.participants.pharmacy.address.country}]]>
                  </ItemDataString>
               </ItemGroupData>
            </FormData>
            <FormData FormOID="Form.clinicalInfo">
               <ItemGroupData ItemGroupOID="ItemGroup.clinicalInfo">
                  <ItemDataString ItemOID="Item.sex">${
                    test.clinicalInfo.sex
                  }</ItemDataString>
                  <ItemDataString ItemOID="Item.age">${
                    test.clinicalInfo.age
                  }</ItemDataString>
                  <ItemDataString ItemOID="Item.weight">${
                    test.clinicalInfo.weight
                  }</ItemDataString>
                  <ItemDataString ItemOID="Item.height">${
                    test.clinicalInfo.height
                  }</ItemDataString>
                  <ItemDataString ItemOID="Item.drugsToTest">
                     <![CDATA[${test.clinicalInfo.drugs}]]>
                  </ItemDataString>
                  <ItemDataString ItemOID="Item.indication">
                     <![CDATA[${test.clinicalInfo.indication}]]>
                  </ItemDataString>
                  <ItemDataString ItemOID="Item.otherDiagnoses">
                     <![CDATA[${test.clinicalInfo.otherDiag}]]>
                  </ItemDataString>
                  <ItemDataString ItemOID="Item.otherMedications">
                     <![CDATA[${test.clinicalInfo.otherDrugs}]]>
                  </ItemDataString>
                  <ItemDataBoolean ItemOID="Item.purpose-efficacy">
                     <![CDATA[${test.clinicalInfo.purpose.efficacy}]]>
                  </ItemDataBoolean>
                  <ItemDataBoolean ItemOID="Item.purpose-side-effects">
                     <![CDATA[${test.clinicalInfo.purpose.sideEffects}]]>
                  </ItemDataBoolean>
                  <ItemDataBoolean ItemOID="Item.purpose-deprescription">
                     <![CDATA[${test.clinicalInfo.purpose.deprescription}]]>
                  </ItemDataBoolean>
                  <ItemDataBoolean ItemOID="Item.purpose-dosage">
                     <![CDATA[${test.clinicalInfo.purpose.dosage}]]>
                  </ItemDataBoolean>
                  <ItemDataBoolean ItemOID="Item.purpose-drugs-choice">
                     <![CDATA[${test.clinicalInfo.purpose.drugsChoice}]]>
                  </ItemDataBoolean>
                  <ItemDataBoolean ItemOID="Item.purpose-generic-substitution">
                     <![CDATA[${
                       test.clinicalInfo.purpose.genericSubstitutions
                     }]]>
                  </ItemDataBoolean>
                  <ItemDataBoolean ItemOID="Item.purpose-other">
                     <![CDATA[${test.clinicalInfo.purpose.other}]]>
                  </ItemDataBoolean>
               </ItemGroupData>
            </FormData>
            <FormData FormOID="Form.nof1-parameters">
               <ItemGroupData ItemGroupOID="ItemGroup.nof1-parameters">
                  <ItemDataInteger ItemOID="Item.nbPeriods">${
                    test.nbPeriods
                  }</ItemDataInteger>
                  <ItemDataInteger ItemOID="Item.periodLen">${
                    test.periodLen
                  }</ItemDataInteger>
                  <ItemDataString ItemOID="Item.statisticalAnalysis">${
                    test.statistics.analysisToPerform
                  }</ItemDataString>
                  <ItemDataString ItemOID="Item.randomizationStrategy">${
                    test.randomization.strategy
                  }${
    test.randomization.maxRep ? ', ' + test.randomization.maxRep : ''
  }</ItemDataString>
                  <ItemDataString ItemOID="Item.administrationSequence">${
                    test.substancesSequence
                  }</ItemDataString>
               </ItemGroupData>
            </FormData>
            ${test.substances.reduce((acc, sub, idx) => {
              const tab = idx > 0 ? '\n            ' : ''; // for indentation
              acc += `${tab}<FormData FormOID="Form.nof1-substance-parameters" FormRepeatKey="${
                sub.name
              }">
               <ItemGroupData ItemGroupOID="ItemGroup.nof1-substance">
                  <ItemDataString ItemOID="Item.substance">
                     <![CDATA[${sub.name}]]>
                  </ItemDataString>
                  <ItemDataString ItemOID="Item.abbreviation">
                     <![CDATA[${sub.abbreviation}]]>
                  </ItemDataString>
                  <ItemDataString ItemOID="Item.unit">
                     <![CDATA[${sub.unit}]]>
                  </ItemDataString>
                  <ItemDataBoolean ItemOID="Item.repeatLast">${
                    sub.posology.repeatLast
                  }</ItemDataBoolean>
               </ItemGroupData>
               ${sub.posology.posology.reduce((prev, p, idx) => {
                 const tab = idx > 0 ? '\n               ' : ''; // for indentation
                 prev += `${tab}<ItemGroupData ItemGroupOID="ItemGroup.nof1-posology" ItemGroupRepeatKey="${p.day}">
                  <ItemDataInteger ItemOID="Item.day">${p.day}</ItemDataInteger>
                  <ItemDataInteger ItemOID="Item.morningDose">${p.morning}</ItemDataInteger>
                  <ItemDataInteger ItemOID="Item.morningFraction">${p.morningFraction}</ItemDataInteger>
                  <ItemDataInteger ItemOID="Item.noonDose">${p.noon}</ItemDataInteger>
                  <ItemDataInteger ItemOID="Item.noonFraction">${p.noonFraction}</ItemDataInteger>
                  <ItemDataInteger ItemOID="Item.eveningDose">${p.evening}</ItemDataInteger>
                  <ItemDataInteger ItemOID="Item.eveningFraction">${p.eveningFraction}</ItemDataInteger>
                  <ItemDataInteger ItemOID="Item.nightDose">${p.night}</ItemDataInteger>
                  <ItemDataInteger ItemOID="Item.nightFraction">${p.nightFraction}</ItemDataInteger>
               </ItemGroupData>`;
                 return prev;
               }, '')}${
                sub.decreasingDosage
                  ? sub.decreasingDosage.reduce((prev, p) => {
                      const tab = '\n               '; // for indentation
                      prev += `${tab}<ItemGroupData ItemGroupOID="ItemGroup.nof1-decreasing-posology" ItemGroupRepeatKey="${p.day}">
                  <ItemDataInteger ItemOID="Item.day">${p.day}</ItemDataInteger>
                  <ItemDataInteger ItemOID="Item.morningDose">${p.morning}</ItemDataInteger>
                  <ItemDataInteger ItemOID="Item.morningFraction">${p.morningFraction}</ItemDataInteger>
                  <ItemDataInteger ItemOID="Item.noonDose">${p.noon}</ItemDataInteger>
                  <ItemDataInteger ItemOID="Item.noonFraction">${p.noonFraction}</ItemDataInteger>
                  <ItemDataInteger ItemOID="Item.eveningDose">${p.evening}</ItemDataInteger>
                  <ItemDataInteger ItemOID="Item.eveningFraction">${p.eveningFraction}</ItemDataInteger>
                  <ItemDataInteger ItemOID="Item.nightDose">${p.night}</ItemDataInteger>
                  <ItemDataInteger ItemOID="Item.nightFraction">${p.nightFraction}</ItemDataInteger>
               </ItemGroupData>`;
                      return prev;
                    }, '')
                  : ''
              }
            </FormData>`;
              return acc;
            }, '')}
            <FormData FormOID="Form.nof1-monitoredVariables-def">
               ${test.monitoredVariables.reduce((acc, v, idx) => {
                 const tab = idx > 0 ? '\n               ' : ''; // for indentation
                 acc += `${tab}<ItemGroupData ItemGroupOID="ItemGroup.nof1-monitoredVariables-def" ItemGroupRepeatKey="${
                   v.name
                 }">
                  <ItemDataString ItemOID="Item.VarName">
                     <![CDATA[${v.name}]]>
                  </ItemDataString>
                  <ItemDataString ItemOID="Item.VarType">
                     <![CDATA[${v.type}]]>
                  </ItemDataString>${
                    v.type === VariableType.Numeric ||
                    v.type === VariableType.VAS
                      ? `\n                  <ItemDataString ItemOID="Item.unit">
                     <![CDATA[${v.unit}]]>
                  </ItemDataString>
                  <ItemDataInteger ItemOID="Item.skippedRunInDays">${v.skippedRunInDays}</ItemDataInteger>`
                      : ''
                  }${
                   v.type !== VariableType.Text &&
                   v.type !== VariableType.Qualitative
                     ? `\n                  <ItemDataString ItemOID="Item.min">
                     <![CDATA[${v.min}]]>
                  </ItemDataString>
                  <ItemDataString ItemOID="Item.max">
                     <![CDATA[${v.max}]]>
                  </ItemDataString>`
                     : ''
                 }${
                   v.type === VariableType.Qualitative
                     ? `\n                  <ItemDataString ItemOID="Item.values">
                     <![CDATA[${v.values}]]>
                  </ItemDataString>`
                     : ''
                 }
               </ItemGroupData>`;
                 return acc;
               }, '')}
            </FormData>
         </StudyEventData>

         <!-- Data -->
         ${data.reduce((acc, current, idx) => {
           const tab = idx > 0 ? '\n         ' : ''; // for indentation
           acc += `${tab}<StudyEventData StudyEventOID="Event.data" StudyEventRepeatKey="${
             current.date
           }">
            <FormData FormOID="Form.nof1-monitoredVariables">
               <ItemGroupData ItemGroupOID="ItemGroup.nof1-monitoredVariables">
                  ${current.data.reduce((prev, d, idx) => {
                    const tab = idx > 0 ? '\n                  ' : ''; // for indentation
                    prev += `${tab}<ItemDataString ItemOID="Item.${d.variableName
                      .toLowerCase()
                      .replaceAll(' ', '-')}">
                     <![CDATA[${d.value}]]>
                  </ItemDataString>`;
                    return prev;
                  }, '')}${
             current.supposition || current.optimal
               ? `\n                  <ItemDataString ItemOID="Item.supposition">
                     <![CDATA[${current.supposition}]]>
                  </ItemDataString>
                  <ItemDataString ItemOID="Item.optimal">
                     <![CDATA[${current.optimal}]]>
                  </ItemDataString>
                  <ItemDataString ItemOID="Item.endPeriodRemark">
                     <![CDATA[${current.endPeriodRemark}]]>
                  </ItemDataString>`
               : ''
           }
               </ItemGroupData>
            </FormData>
         </StudyEventData>`;
           return acc;
         }, '')}
      </SubjectData>
   </ClinicalData>
</ODM>`;
};

/**
 * Hash method to anonymize identifying information.
 * @param val Value to hash.
 * @returns The hashed value.
 */
const hash = (val: string) =>
  val ? bcrypt.hash(val, 10) : Promise.resolve(val);

/**
 * Hashes identifying information.
 * @param p A Patient | Physician | Pharmacy.
 * @param hash The hash/encryption method.
 * @returns The hashed identifying information.
 */
const hashCommon = async (
  p: Patient | Physician | Pharmacy,
  hash: (val: string) => Promise<string>,
) => ({
  phone: await hash(p.phone),
  email: await hash(p.email),
  address: {
    street: await hash(p.address.street),
    city: await hash(p.address.city),
    zip: await hash(p.address.zip),
    country: p.address.country,
  },
});

/**
 * Hashes identifying information of a person.
 * @param p A Patient | Physician.
 * @param hash The hash/encryption method.
 * @returns The hashed identifying information of a person.
 */
const hashPerson = async (
  p: Patient | Physician,
  hash: (val: string) => Promise<string>,
) => ({
  firstname: await hash(p.firstname),
  lastname: await hash(p.lastname),
  ...(await hashCommon(p, hash)),
});

/**
 * Generates an XML string representing an XML file, in ODM-XML format,
 * containing all the information about a N-of-1 test and its patient's data.
 * Identifying information about people involved in the N-of-1 test is hashed.
 * @param test N-of-1 test.
 * @param data Patient's data fo the N-of-1 test.
 * @returns An anonymized XML string.
 */
export const anonymousXML = async (test: Nof1Test, data: TestData) => {
  const patient: Patient = {
    ...(await hashPerson(test.participants.patient, hash)),
    birthYear: await hash(test.participants.patient.birthYear),
    insurance: await hash(test.participants.patient.insurance),
    insuranceNb: await hash(test.participants.patient.insuranceNb),
  };
  const requestingPhysician: Physician = {
    ...(await hashPerson(test.participants.requestingPhysician, hash)),
    institution: test.participants.requestingPhysician.institution,
    tests: [],
  };
  const nof1Physician: Physician = {
    ...(await hashPerson(test.participants.nof1Physician, hash)),
    institution: test.participants.nof1Physician.institution,
    tests: [],
  };
  const pharmacy: Pharmacy = {
    name: await hash(test.participants.pharmacy.name),
    ...(await hashCommon(test.participants.pharmacy, hash)),
  };
  const anonymousTest: Nof1Test = {
    ...test,
    participants: {
      patient,
      requestingPhysician,
      nof1Physician,
      pharmacy,
    },
  };
  return generateOdmXML(anonymousTest, data);
};

/**
 * Promise wrapper of the encrypt method.
 * @param val Value to encrypt.
 * @returns A string promise.
 */
const encryptAsync = (val: string) => Promise.resolve(encrypt(val));

/**
 * Generates an XML string representing an XML file, in ODM-XML format,
 * containing all the information about a N-of-1 test and its patient's data.
 * Identifying information about people involved in the N-of-1 test is encrypted.
 * @param test N-of-1 test.
 * @param data Patient's data fo the N-of-1 test.
 * @returns An encrypted XML string.
 */
export const encryptedXML = async (test: Nof1Test, data: TestData) => {
  const patient: Patient = {
    ...(await hashPerson(test.participants.patient, encryptAsync)),
    birthYear: await encryptAsync(test.participants.patient.birthYear),
    insurance: await encryptAsync(test.participants.patient.insurance),
    insuranceNb: await encryptAsync(test.participants.patient.insuranceNb),
  };
  const requestingPhysician: Physician = {
    ...(await hashPerson(test.participants.requestingPhysician, encryptAsync)),
    institution: test.participants.requestingPhysician.institution,
    tests: [],
  };
  const nof1Physician: Physician = {
    ...(await hashPerson(test.participants.nof1Physician, encryptAsync)),
    institution: test.participants.nof1Physician.institution,
    tests: [],
  };
  const pharmacy: Pharmacy = {
    name: await encryptAsync(test.participants.pharmacy.name),
    ...(await hashCommon(test.participants.pharmacy, encryptAsync)),
  };
  const encryptedTest: Nof1Test = {
    ...test,
    participants: {
      patient,
      requestingPhysician,
      nof1Physician,
      pharmacy,
    },
  };
  return generateOdmXML(encryptedTest, data);
};
